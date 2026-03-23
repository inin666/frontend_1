# 微信小程序 UI 展示机制调研报告

基于 `uni-app + Vue 3 + TypeScript + mp-weixin`。调研时间为 `2026-03-23`，目标是解释为什么很多在 Web 里“看起来没毛病”的组件，到了微信小程序里会出现展示、交互、层级、样式覆盖和兼容性问题。

## 结论

当前项目遇到的问题，本质上不是“组件写得不够精细”，而是把微信小程序当成浏览器在写。微信小程序确实长得像 Web，但它不是浏览器 DOM，也不是完整 CSS，也不是完整事件模型。`uni-app` 只是在语法层帮你抹平一部分差异，抹不平运行时和渲染引擎的差异。

对这个仓库来说，最核心的结论有 6 条：

1. 小程序是“逻辑层 + 渲染层”双线程模型，不是单线程 DOM 页面。很多 Web 习惯在这里天然失效，或者只剩表面语法兼容。
2. `WXSS` 只支持 CSS 的一个子集。你能写进去，不代表它在所有小程序渲染场景里都稳定。
3. 自定义组件默认带样式隔离。父组件想当然地改子组件内部样式，经常不生效。
4. 原生组件有自己的层级体系。涉及 `camera`、`video`、`map`、`canvas` 这类能力时，普通 `view` 盖不上去。
5. 事件模型是触摸优先，不是键盘优先。`role`、`tabindex`、`keydown` 这套 Web 语义，在手机小程序里基本不是主路径。
6. 微信现在同时存在 `WebView` 和 `Skyline` 两套渲染路径。今天没炸的 CSS，不代表未来切渲染器也没事。

## 官方机制

### 1. 小程序不是浏览器页面

微信官方文档明确说明，小程序框架由逻辑层 `App Service` 和视图层 `View` 组成；`WXML` 和 `WXSS` 在渲染层工作，`JS` 在逻辑层工作，二者通过数据传输和事件系统通信。宿主环境文档进一步说明，渲染层由 `WebView` 渲染，逻辑层由 `JsCore` 线程运行。

这意味着：

- 你不是在直接操作浏览器 DOM。
- 事件、渲染、样式计算、数据更新都经过框架和宿主中转。
- “Web 能这么写”不等于“小程序也按同一语义执行”。

对 UI 最直接的影响是：组件展示异常时，问题常常不在组件本身，而在宿主运行机制、事件通信和平台组件限制。

### 2. `WXSS` 不是完整 CSS

微信 `WXSS` 文档明确说，它“具有 CSS 大部分特性”，但不是完整 CSS。官方列出的基础选择器支持范围很有限，主要是：

- 类选择器
- ID 选择器
- 元素选择器
- 分组选择器
- `::before` / `::after`

此外，官方明确强调了两件事：

- 小程序推荐使用 `rpx`，并提示小屏幕上不可避免会有毛刺。
- 动态样式建议放 `style`，静态样式应尽量放 `class`，因为运行时解析 `style` 会影响渲染速度。

这类限制会直接导致：

- 很新的选择器或复杂布局语法不一定稳定。
- 精细像素、毛玻璃、极细边框、复杂阴影在真机上更容易失真。
- 静态样式写进内联 `style` 会增加运行时负担。

### 3. 自定义组件默认样式隔离

微信自定义组件文档明确说明，组件默认有样式隔离。搜索结果中的官方文档摘要列出了 `styleIsolation` 的核心取值：

- `isolated`：默认值，组件内外 `class` 样式互不影响。
- `apply-shared`：页面 `wxss` 可以影响组件。
- `shared`：页面和组件样式可以相互影响。

同一文档还说明了 `externalClasses` 的存在，用于显式开放外部样式类。

这意味着：

- 父页面给子组件外层加一个类，不代表能改到子组件内部结构。
- 公共组件一多，样式覆盖会变成显式设计问题，而不是“顺手改一下类名”的问题。
- 如果没有设计好 `externalClasses` 或组件边界，UI 调整会越来越痛苦。

### 4. 原生组件层级不是普通层级

微信 `cover-view` 官方文档明确写了：它只能覆盖特定原生组件，包括 `map`、`video`、`canvas`、`camera`、`live-player`、`live-pusher`，而且只支持嵌套 `cover-view`。

`uni-app` 官方文档也明确提醒：在小程序和 `webview` 渲染场景里，原生组件层级高于普通前端组件，需要使用 `cover-view` 等特殊组件处理遮挡。

这意味着：

- 你不能假设 `z-index` 能解决所有遮罩、浮层、悬浮按钮问题。
- 一旦页面接入摄像头、视频、地图、画布，普通弹层和角标很可能直接被“吃掉”。
- 覆盖原生组件要提前按平台能力设计，不能事后补 CSS。

### 5. 事件模型不是 Web 键盘模型

微信事件系统文档列出的标准冒泡事件核心是 `touchstart`、`touchmove`、`touchend`、`tap`、`longpress`、动画和过渡事件。官方范式也是 `bindtap` / `catchtap` 这一类触摸事件。

这意味着：

- 手机小程序的主交互路径是触摸，不是键盘。
- `role="button"`、`tabindex="0"`、`@keydown.enter`、`@keydown.space` 这类写法，即使编译不报错，也不是微信小程序交互的主语义。
- 它们更像从 Web 复制过来的“表面无障碍写法”，但不能真正替代小程序的按钮、导航和触摸事件模型。

### 6. `button`、`form`、`input` 有组件边界语义

微信官方 `button` 文档明确提示：设置了 `form-type` 的 `button` 只对当前组件中的 `form` 有效。如果 `button` 被封装在自定义组件内，而 `form` 在自定义组件外，`form-type` 会失效。

官方 `input` 文档也有同类提示：如果 `input` 在自定义组件内，而 `form` 在组件外，`form` 不能直接拿到该 `input` 的值。

这意味着：

- 你不能把 Web 的“按钮只是一个样式块”思路带进来。
- 在小程序里，`button`、`input`、`form` 不是纯视觉组件，它们还自带宿主行为。
- 一旦跨组件封装，提交、取值、开放能力都可能变味。

### 7. `Skyline` 让问题变成“两套渲染世界”

微信官方说明，小程序原来长期使用 `AppService + WebView` 的双线程模型；为提升性能，又新增了 `Skyline` 渲染引擎。`Skyline` 官方 WXSS 支持页明确写出它和 WebView 有差异，例如：

- `Inline` 布局不支持。
- `Inline-block` 仅部分支持。
- `position: sticky` 不直接支持，建议用 `sticky-header` / `sticky-section`。
- `overflow: scroll` 不支持，只能用 `scroll-view`。
- `z-index` 不支持层叠上下文，只对兄弟节点生效。
- `fixed` 有版本限制，且只相对窗口定位。
- `display` 默认值是 `flex`。
- `box-sizing` 默认值是 `border-box`。

当前项目没有看到 `Skyline` 配置，所以现阶段大概率还是跑在传统 `WebView` 路径上。这是基于仓库配置做的推断，不是官方配置回读结果。

但这里的风险很现实：今天你写的样式如果强依赖 Web 心智，未来一旦切 `Skyline`，很多布局会立即暴露问题。

## 与当前仓库的对应关系

下面是我把官方机制映射到当前代码库后的结果。

### 高风险项

#### 1. 把 `view` 当成 Web 按钮在用

涉及文件：

- `src/uni-app/pages/training/home.vue`
- `src/components/training/TrainingModeCard.vue`
- `src/components/access/QuestionnaireResultCard.vue`

共同特征：

- `role="button"`
- `tabindex="0"`
- `@keydown.enter`
- `@keydown.space`

问题判断：

- 这是典型的 Web 语义残留。
- 在微信小程序的手机主场景里，真正可靠的是触摸事件和原生表单/导航组件语义。
- 这类代码不会帮你解决实际的小程序交互一致性，反而会制造“我们已经兼容了”的错觉。

建议：

- 普通点击跳转优先使用 `button` / `navigator` / `uni.navigateTo` 对应的原生语义组件方案。
- 只在确认有桌面端小程序和明确键盘需求时，再单独补平台特化逻辑。

#### 2. 在共享组件里大量使用 Web 风格布局糖

涉及文件：

- `src/components/growth/GrowthSummaryCards.vue`
- `src/components/growth/AdherenceHeatmap.vue`
- `src/components/access/RegistrationForm.vue`
- `src/components/training/DailyProgressCard.vue`

典型写法：

- `display: grid`
- `repeat(auto-fill, minmax(...))`
- `grid-auto-flow: column`
- `grid-template-rows: repeat(...)`
- 各种 `gap`

问题判断：

- 这些写法在当前 `WebView` 路径下不一定立刻出错，但它们不是最稳的小程序布局写法。
- `uni-app` 官方跨端建议明确偏向 `flex`。
- 微信 `Skyline` 支持表里没有把 Grid 列为一等公民能力，这意味着你们现在的 Grid 用法对未来渲染器迁移不友好。

建议：

- 业务关键路径页优先回到 `flex`。
- `grid + auto-fill + minmax` 这种写法不要进入核心组件库。
- Heatmap 这类天然二维结构，如果继续用 grid，至少要列入真机专项验收。

#### 3. 依赖 `fixed`、大装饰层和复杂过渡来撑视觉

涉及文件：

- `src/components/access/AccessPageShell.vue`
- `src/uni-app/pages/training/home.vue`
- `src/uni-app/pages/growth/index.vue`
- `uno.config.ts`

典型写法：

- `min-h-screen`
- `fixed`
- `transition-all`
- 大面积阴影和装饰背景

问题判断：

- 小程序不是纯浏览器视口模型，`fixed`、滚动容器、导航栏、页面容器之间的关系更容易出边界问题。
- `Skyline` 对 `fixed`、`z-index`、`overflow` 都有明确限制。
- 大量依赖通用过渡和大尺寸装饰层，会把“好看”建立在最容易抖动的平台特性上。

建议：

- 小程序首屏和核心流程页面少用大面积固定装饰层。
- 页面骨架优先稳定，再叠视觉强化。
- 对 `fixed`、层级、滚动的组合建立真机回归清单。

#### 4. 共享样式体系对组件边界控制不够显式

涉及文件：

- `src/components/**`
- `src/uni-app/components/**`

问题判断：

- 你们大量依赖全局工具类和 shortcut，但仓库里没有看到对 `styleIsolation`、`externalClasses`、`addGlobalClass` 的显式策略。
- 这会让“一个组件能不能被页面样式稳定接管”完全靠运气。
- 组件越多，后续越容易出现“这个类在 A 页面生效，在 B 页面不生效”的情况。

建议：

- 建立组件级样式边界规则。
- 明确哪些组件允许外部改视觉，哪些不允许。
- 对允许外部改视觉的组件，设计 `externalClasses` 或等价的可扩展接口，而不是靠父级穿透猜命中。

### 中风险项

#### 5. 内联样式和运行时样式解析偏多

涉及文件：

- `src/components/access/AccessPageShell.vue`
- `src/components/access/QuestionnaireResultCard.vue`

典型写法：

- `style="text-shadow: ..."`
- `style="animation-duration: 2s;"`

问题判断：

- 微信官方明确建议把静态样式放进 `class`，不要放进 `style`。
- 这里量不算特别夸张，但已经说明当前代码在朝“写起来快”的方向偏，而不是朝“小程序稳定渲染”的方向偏。

建议：

- 静态样式尽量回收到 class 或局部样式表。
- `style` 只留给真正的动态计算值。

#### 6. 视觉组件已经带有明显平台补丁史

证据文件：

- `src/tests/uiReviewFixes.spec.ts`

这个测试已经在检查很多典型小程序坑：

- 避免 `peer-*` 兄弟选择器语法
- 避免 web font icon 依赖
- 避免直接使用 `<button>` 的某些方式
- 使用 `picker`
- 使用 `form-type="submit"`

这说明团队其实已经踩过一轮坑了。现在的问题不是“有没有平台差异”，而是“平台差异还没有被系统化约束到组件设计原则里”。

## 当前项目里相对做对了的地方

这部分不是表扬，是为了区分“已经适配的平台写法”和“还在冒险的平台写法”。

### 1. 注册表单已经开始用小程序原生思路

`src/components/access/RegistrationForm.vue` 做了几件对的事：

- 用 `picker` 代替 Web 式下拉框。
- 用 `button form-type="submit"` 走小程序表单语义。
- 输入组件都保留了 `name`。

这部分说明你们不是完全没往小程序思路迁移，只是这种迁移还没有覆盖到所有交互组件。

### 2. 当前项目尚未启用 `Skyline`

仓库里没有看到 `Skyline` 相关配置。短期内，这意味着你们先只需要把 `WebView` 小程序路径走稳。

但这不代表可以继续按 Web 心智放飞。因为只要你们现在不控制 CSS 复杂度，后面一旦考虑性能或渲染升级，技术债会一次性爆出来。

## 我给这份项目的判断

现在很多 UI “展示有问题”，不是单个组件 bug，而是下面三件事叠加：

1. 视觉层仍然混着 Web 语义和小程序语义。
2. 组件边界没有围绕“小程序样式隔离”重新定义。
3. 布局体系里用了不少在 Web 里舒服、在小程序里高风险的写法。

如果不先统一原则，只是逐个修页面，后面一定会出现：

- 这个页面修好了，另一个页面又歪了。
- H5 预览正常，微信真机不一致。
- 组件库改一个 class，三个页面一起炸。

## 建议的整改顺序

### P0. 先定一份“小程序组件写法红线”

至少包括：

- 关键流程组件禁用 `role/tabindex/@keydown` 式 Web 按钮模拟。
- 关键流程组件优先 `flex`，限制 `grid` 的使用场景。
- 静态样式不写内联 `style`。
- 设计系统里明确哪些组件允许外部改样式。
- 凡是未来可能覆盖原生组件的页面，提前按 `cover-view` 设计。

### P1. 统一交互组件语义

把 CTA、卡片点击、跳转入口这批组件统一梳理一遍，明确：

- 哪些必须是 `button`
- 哪些必须是 `navigator`
- 哪些只是普通 `view + tap`

不要继续混搭。

### P2. 清理核心页面的高风险布局

优先页面：

- 训练首页
- 训练模式选择
- 问卷结果页
- 成长中心首页

优先处理：

- Grid 自动布局
- 固定装饰层
- 大量 `transition-all`
- 伪 Web 无障碍语义

### P3. 建立真机验收矩阵

至少分 3 维：

- 开发者工具
- iOS 微信真机
- Android 微信真机

只看开发者工具，结论不可靠。

## 参考资料

### 微信官方文档

- 小程序框架介绍: <https://developers.weixin.qq.com/miniprogram/dev/framework/MINA.html>
- 小程序宿主环境: <https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/framework.html>
- WXSS: <https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html>
- 事件系统: <https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html>
- 自定义组件模板和样式: <https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html>
- button: <https://developers.weixin.qq.com/miniprogram/dev/component/button.html>
- form: <https://developers.weixin.qq.com/miniprogram/dev/component/form>
- cover-view: <https://developers.weixin.qq.com/miniprogram/dev/component/cover-view>
- Skyline 介绍: <https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/introduction.html>
- Skyline WXSS 支持与差异: <https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/wxss.html>

### uni-app 官方文档

- H5 正常但小程序异常的可能性: <https://uniapp.dcloud.net.cn/matter.html>
- 组件入门与原生组件说明: <https://uniapp.dcloud.net.cn/component>
- 条件编译处理多端差异: <https://uniapp.dcloud.net.cn/tutorial/platform.html>

## 附：本次调研涉及的仓库文件

- `package.json`
- `src/uni-app/manifest.json`
- `src/uni-app/pages.json`
- `src/uni-app/pages/training/home.vue`
- `src/components/training/TrainingModeCard.vue`
- `src/components/access/QuestionnaireResultCard.vue`
- `src/components/growth/GrowthSummaryCards.vue`
- `src/components/growth/AdherenceHeatmap.vue`
- `src/components/access/AccessPageShell.vue`
- `src/components/access/RegistrationForm.vue`
- `src/tests/uiReviewFixes.spec.ts`
