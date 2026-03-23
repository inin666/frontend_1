import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it, vi } from 'vitest'
import RegistrationForm from '../components/access/RegistrationForm.vue'
import HomePage from '../views/training/HomePage.vue'

vi.mock('../composables/useStudentAppState', () => ({
  useStudentAppState: () => ({
    state: {
      reminderSource: null,
      dailyAdherence: {
        validCheckIns: 0,
        reminderEligible: true
      },
      weeklyAdherence: {
        qualifyingDays: 0
      }
    },
    refreshReminderEligibility: vi.fn(),
    setReminderSource: vi.fn()
  })
}))

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/home', component: HomePage },
      { path: '/training/select', component: { template: '<div>training</div>' } },
      { path: '/growth', component: { template: '<div>growth</div>' } }
    ]
  })
}

describe('ui review fixes', () => {
  it('uses links for home page navigation actions', async () => {
    const router = createTestRouter()
    await router.push('/home')
    await router.isReady()

    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })

    const actionLinks = wrapper.findAll('a').map(link => link.attributes('href'))

    expect(actionLinks).toEqual(expect.arrayContaining(['/training/select', '/growth']))
  })

  it('keeps stable metadata on registration inputs and uses picker selectors for miniapp fields', () => {
    const file = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/RegistrationForm.vue'),
      'utf8'
    )

    expect(file).toContain('input v-model.trim="form.studentId" autocomplete="username"')
    expect(file).toContain('input v-model.trim="form.name" autocomplete="name"')
    expect(file).toContain('input v-model.trim="form.major" autocomplete="organization-title"')
    expect(file).toContain('input v-model.number="form.heightCm" autocomplete="off"')
    expect(file).toContain('input v-model.number="form.weightKg" autocomplete="off"')
    expect(file).toContain('input v-model.number="form.restingHeartRate" autocomplete="off"')
    expect(file).toContain('mode="selector"')
    expect(file).toContain(':range="genderOptions"')
    expect(file).toContain(':range="gradeOptions"')
    expect(file).not.toContain('space-y-')
  })

  it('avoids peer-based selectors that compile to invalid wxss sibling syntax', () => {
    const shortQuestionnaireForm = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/ShortQuestionnaireForm.vue'),
      'utf8'
    )
    const longQuestionnaireForm = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/LongQuestionnaireForm.vue'),
      'utf8'
    )

    expect(shortQuestionnaireForm).not.toContain('peer-checked:')
    expect(shortQuestionnaireForm).not.toContain('sr-only peer')
    expect(longQuestionnaireForm).not.toContain('peer-checked:')
    expect(longQuestionnaireForm).not.toContain('sr-only peer')
  })

  it('avoids web font icon dependencies in miniapp-shared forms', () => {
    const registrationForm = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/RegistrationForm.vue'),
      'utf8'
    )
    const shortQuestionnaireForm = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/ShortQuestionnaireForm.vue'),
      'utf8'
    )

    expect(registrationForm).not.toContain('material-symbols-outlined')
    expect(registrationForm).not.toContain('font-variation-settings')
    expect(shortQuestionnaireForm).not.toContain('material-symbols-outlined')
    expect(shortQuestionnaireForm).not.toContain('font-variation-settings')
  })

  it('prefers text nodes over span tags in primary miniapp-shared components', () => {
    const files = [
      '/Users/pi-dal/Developer/sport-snack/src/components/access/AccessPageShell.vue',
      '/Users/pi-dal/Developer/sport-snack/src/components/access/RegistrationForm.vue',
      '/Users/pi-dal/Developer/sport-snack/src/components/training/TrainingModeCard.vue',
      '/Users/pi-dal/Developer/sport-snack/src/components/training/DailyProgressCard.vue',
      '/Users/pi-dal/Developer/sport-snack/src/components/training/StairTrainingPanel.vue',
      '/Users/pi-dal/Developer/sport-snack/src/components/training/VisualTrainingPanel.vue',
      '/Users/pi-dal/Developer/sport-snack/src/components/training/ShortQuestionnaireForm.vue'
    ]

    for (const filePath of files) {
      const file = readFileSync(resolve(filePath), 'utf8')

      expect(file).not.toContain('<span')
    }
  })

  it('uses miniapp form submission semantics on shared forms', () => {
    const files = [
      '/Users/pi-dal/Developer/sport-snack/src/components/access/RegistrationForm.vue',
      '/Users/pi-dal/Developer/sport-snack/src/components/access/LongQuestionnaireForm.vue',
      '/Users/pi-dal/Developer/sport-snack/src/components/training/ShortQuestionnaireForm.vue'
    ]

    for (const filePath of files) {
      const file = readFileSync(resolve(filePath), 'utf8')

      expect(file).toContain('form-type="submit"')
    }
  })

  it('adds visible hover and focus states for growth detail links', () => {
    const file = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/views/growth/GrowthCenterView.vue'),
      'utf8'
    )

    expect(file).toContain('.growth-page__link:hover')
    expect(file).toContain('.growth-page__link:focus-visible')
  })

  it('uses uni-app navigation semantics for the primary access flow', () => {
    const registerPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/access/register.vue'),
      'utf8'
    )
    const questionnairePage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/access/questionnaire.vue'),
      'utf8'
    )
    const resultPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/access/questionnaire-result.vue'),
      'utf8'
    )

    expect(registerPage).toContain('uni.redirectTo')
    expect(questionnairePage).toContain('uni.navigateTo')
    expect(resultPage).toContain('uni.redirectTo')
  })

  it('uses uni-app navigation semantics for the primary training flow', () => {
    const homePage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/training/home.vue'),
      'utf8'
    )
    const selectionPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/training/select.vue'),
      'utf8'
    )
    const feedbackPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/training/feedback.vue'),
      'utf8'
    )

    expect(homePage).toContain('<navigator')
    expect(homePage).toContain('url="/pages/training/select"')
    expect(homePage).toContain('url="/pages/growth/index"')
    expect(selectionPage).toContain('uni.navigateTo')
    expect(feedbackPage).toContain('uni.redirectTo')
  })

  it('preserves clear interactive affordance on growth detail navigation after migration', () => {
    const growthIndexPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/growth/index.vue'),
      'utf8'
    )
    const metricsPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/growth/metrics.vue'),
      'utf8'
    )

    expect(growthIndexPage).toContain('uni.navigateTo')
    expect(growthIndexPage).toContain('.growth-page__link:active')
    expect(growthIndexPage).toContain('growth-page__link--current')
    expect(metricsPage).toContain('Physical metrics will appear here after body-test data is imported.')
  })

  it('uses larger typography and stable action sizing for miniapp result and home surfaces', () => {
    const resultCard = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/QuestionnaireResultCard.vue'),
      'utf8'
    )
    const progressCard = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/DailyProgressCard.vue'),
      'utf8'
    )
    const reminderBanner = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/ReminderBanner.vue'),
      'utf8'
    )
    const miniappHomePage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/training/home.vue'),
      'utf8'
    )
    const webHomePage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/views/training/HomePage.vue'),
      'utf8'
    )

    expect(resultCard).toContain('text-[32rpx] text-slate-500 font-800')
    expect(resultCard).toContain('text-[48rpx] font-800 text-slate-600')
    expect(resultCard).toContain('text-[40rpx] font-900 text-[#065F46]')
    expect(resultCard).toContain('btn-primary mt-[48rpx]')
    expect(progressCard).toContain('text-[34rpx] leading-8 text-slate-600 font-700')
    expect(progressCard).toContain('px-[32rpx] py-[20rpx] text-[40rpx] font-900')
    expect(progressCard).toContain('gap-[24rpx] text-[28rpx] text-slate-600 font-700')
    expect(reminderBanner).toContain('text-[36rpx] font-900 tracking-[0.16em] uppercase')
    expect(reminderBanner).toContain('text-[32rpx] leading-snug font-700')
    expect(miniappHomePage).toContain('text-[34rpx] leading-8 text-slate-600 font-700')
    expect(miniappHomePage).toContain('min-height: 108rpx;')
    expect(miniappHomePage).toContain('min-width: 0;')
    expect(miniappHomePage).toContain('flex: 1 1 0;')
    expect(webHomePage).toContain('text-[28px] leading-[40px] text-slate-600')
    expect(webHomePage).toContain('min-height: 4rem;')
    expect(webHomePage).toContain('min-width: 0;')
    expect(webHomePage).toContain('flex: 1 1 0;')
  })

  it('keeps result and training selection surfaces compatible with miniapp layout constraints', () => {
    const resultCard = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/QuestionnaireResultCard.vue'),
      'utf8'
    )
    const trainingModeCard = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/TrainingModeCard.vue'),
      'utf8'
    )
    const miniappSelectPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/training/select.vue'),
      'utf8'
    )
    const webSelectPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/views/training/TrainingSelectionPage.vue'),
      'utf8'
    )

    expect(resultCard).toContain('const submittedAtLabel = computed(() => {')
    expect(resultCard).toContain("return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toLocaleString()")
    expect(resultCard).toContain('v-if="submittedAtLabel"')
    expect(resultCard).toContain('text-[32rpx] text-slate-500 font-800')
    expect(resultCard).toContain('text-[48rpx] font-800 text-slate-600')
    expect(resultCard).toContain('text-[40rpx] font-900 text-[#065F46]')
    expect(trainingModeCard).toContain('training-mode-card')
    expect(trainingModeCard).toContain('text-[40rpx] font-900 text-brand-ink')
    expect(trainingModeCard).toContain('text-[32rpx] leading-snug text-slate-600 font-700')
    expect(trainingModeCard).toContain('min-height: 320rpx;')
    expect(trainingModeCard).toContain('display: flex;')
    expect(miniappSelectPage).toContain('text-17 leading-7 text-slate-600')
    expect(webSelectPage).toContain('text-17 leading-7 text-slate-600')
  })

  it('removes web keyboard affordances from miniapp-first action surfaces', () => {
    const resultCard = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/QuestionnaireResultCard.vue'),
      'utf8'
    )
    const trainingModeCard = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/TrainingModeCard.vue'),
      'utf8'
    )
    const miniappHomePage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/training/home.vue'),
      'utf8'
    )

    expect(resultCard).not.toContain('role="button"')
    expect(resultCard).not.toContain('tabindex="0"')
    expect(resultCard).not.toContain('@keydown.enter.prevent')
    expect(resultCard).not.toContain('@keydown.space.prevent')
    expect(resultCard).toContain('<button')
    expect(resultCard).toContain('type="button"')

    expect(trainingModeCard).not.toContain('role="button"')
    expect(trainingModeCard).not.toContain('tabindex="0"')
    expect(trainingModeCard).not.toContain('@keydown.enter.prevent')
    expect(trainingModeCard).not.toContain('@keydown.space.prevent')

    expect(miniappHomePage).toContain('<navigator')
    expect(miniappHomePage).toContain('url="/pages/training/select"')
    expect(miniappHomePage).toContain('url="/pages/growth/index"')
    expect(miniappHomePage).not.toContain('role="button"')
    expect(miniappHomePage).not.toContain('tabindex="0"')
    expect(miniappHomePage).not.toContain('@keydown.enter.prevent')
    expect(miniappHomePage).not.toContain('@keydown.space.prevent')
  })

  it('avoids grid and fixed decoration on miniapp-critical shared surfaces', () => {
    const progressCard = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/DailyProgressCard.vue'),
      'utf8'
    )
    const summaryCards = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/growth/GrowthSummaryCards.vue'),
      'utf8'
    )
    const adherenceHeatmap = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/growth/AdherenceHeatmap.vue'),
      'utf8'
    )
    const accessShell = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/AccessPageShell.vue'),
      'utf8'
    )
    const unoConfig = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/uno.config.ts'),
      'utf8'
    )

    expect(progressCard).not.toContain('grid grid-cols-3')
    expect(summaryCards).not.toContain('display: grid;')
    expect(summaryCards).not.toContain('grid-template-columns:')
    expect(adherenceHeatmap).not.toContain('display: grid;')
    expect(adherenceHeatmap).not.toContain('grid-auto-flow:')
    expect(adherenceHeatmap).not.toContain('grid-template-rows:')
    expect(accessShell).not.toContain('class="fixed')
    expect(accessShell).not.toContain(' fixed ')
    expect(unoConfig).not.toContain("'bouncy-btn': 'transition-all")
  })

  it('keeps registration and growth shared surfaces on flex-first miniapp layouts', () => {
    const registrationForm = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/RegistrationForm.vue'),
      'utf8'
    )
    const achievementBadgeList = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/growth/AchievementBadgeList.vue'),
      'utf8'
    )
    const physicalMetricsPanel = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/growth/PhysicalMetricsPanel.vue'),
      'utf8'
    )
    const trainingHistoryList = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/growth/TrainingHistoryList.vue'),
      'utf8'
    )
    const assessmentHistoryList = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/growth/AssessmentHistoryList.vue'),
      'utf8'
    )

    expect(registrationForm).not.toContain('grid grid-cols-2')
    expect(registrationForm).toContain('form-row')
    expect(achievementBadgeList).not.toContain('display: grid;')
    expect(achievementBadgeList).not.toContain('grid-template-columns:')
    expect(physicalMetricsPanel).not.toContain('display: grid;')
    expect(trainingHistoryList).not.toContain('display: grid;')
    expect(assessmentHistoryList).not.toContain('display: grid;')
  })

  it('keeps registration inputs visually narrower than the surrounding card shell', () => {
    const registrationForm = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/RegistrationForm.vue'),
      'utf8'
    )

    expect(registrationForm).toContain('registration-input-shell')
    expect(registrationForm).toContain('registration-picker-shell')
    expect(registrationForm).toContain('form-stack-field')
    expect(registrationForm).toContain('max-width: 480rpx;')
    expect(registrationForm).toContain('align-self: flex-start;')
    expect(registrationForm).not.toContain('class="w-full"')
  })

  it('keeps training panels and miniapp shells on low-risk layout and motion primitives', () => {
    const visualTrainingPanel = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/VisualTrainingPanel.vue'),
      'utf8'
    )
    const stairTrainingPanel = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/StairTrainingPanel.vue'),
      'utf8'
    )
    const sessionFeedbackCard = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/SessionFeedbackCard.vue'),
      'utf8'
    )
    const uniGrowthShell = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/components/growth/UniGrowthPageShell.vue'),
      'utf8'
    )
    const accessShell = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/AccessPageShell.vue'),
      'utf8'
    )

    expect(visualTrainingPanel).not.toContain('grid grid-cols[')
    expect(visualTrainingPanel).not.toContain('grid grid-cols-')
    expect(visualTrainingPanel).not.toContain('transition-all')
    expect(stairTrainingPanel).not.toContain('transition-all')
    expect(sessionFeedbackCard).not.toContain('grid grid-cols-2')
    expect(uniGrowthShell).not.toContain('display: grid;')
    expect(accessShell).not.toContain('transition-all')
    expect(accessShell).not.toContain('animate-bounce')
    expect(accessShell).not.toContain('text-shadow:')
  })

  it('applies the demo-inspired playful shell language across entry surfaces', () => {
    const accessShell = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/AccessPageShell.vue'),
      'utf8'
    )
    const uniAccessShell = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/components/access/UniAccessPageShell.vue'),
      'utf8'
    )
    const uniGrowthShell = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/components/growth/UniGrowthPageShell.vue'),
      'utf8'
    )
    const uniTrainingShell = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/components/training/UniTrainingPageShell.vue'),
      'utf8'
    )
    const growthIndexPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/growth/index.vue'),
      'utf8'
    )
    const miniappHomePage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/training/home.vue'),
      'utf8'
    )
    const webHomePage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/views/training/HomePage.vue'),
      'utf8'
    )

    expect(accessShell).toContain('access-shell__hero-badge')
    expect(accessShell).toContain('access-shell__title-card')
    expect(uniAccessShell).toContain('access-entry__hero-badge')
    expect(uniAccessShell).toContain('access-entry__title-card')
    expect(uniGrowthShell).toContain('growth-shell__halo')
    expect(uniTrainingShell).toContain('training-shell__halo')
    expect(growthIndexPage).toContain('growth-page__eyebrow')
    expect(growthIndexPage).toContain('growth-page__section-shell')
    expect(miniappHomePage).toContain('home-page__hero-tag')
    expect(webHomePage).toContain('home-page__hero-tag')
  })

  it('brings demo-style badge and sticker treatments into shared cards', () => {
    const registrationForm = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/RegistrationForm.vue'),
      'utf8'
    )
    const dailyProgressCard = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/DailyProgressCard.vue'),
      'utf8'
    )
    const reminderBanner = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/ReminderBanner.vue'),
      'utf8'
    )
    const summaryCards = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/growth/GrowthSummaryCards.vue'),
      'utf8'
    )

    expect(registrationForm).toContain('form-card__sticker')
    expect(registrationForm).toContain('form-card__kicker')
    expect(dailyProgressCard).toContain('progress-card__eyebrow')
    expect(dailyProgressCard).toContain('progress-card__meter-pill')
    expect(reminderBanner).toContain('reminder-banner__eyebrow')
    expect(summaryCards).toContain('summary-card__pill')
    expect(summaryCards).toContain('summary-card--highlight')
  })

  it('aligns training selection surfaces with the demo hero-and-sticker language', () => {
    const webSelectPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/views/training/TrainingSelectionPage.vue'),
      'utf8'
    )
    const miniappSelectPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/training/select.vue'),
      'utf8'
    )
    const trainingModeCard = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/TrainingModeCard.vue'),
      'utf8'
    )

    expect(webSelectPage).toContain('select-page__hero-tag')
    expect(webSelectPage).toContain('select-page__hero-card')
    expect(miniappSelectPage).toContain('select-page__hero-tag')
    expect(miniappSelectPage).toContain('select-page__hero-card')
    expect(trainingModeCard).toContain('training-mode-card__sticker')
    expect(trainingModeCard).toContain('training-mode-card__cta')
    expect(trainingModeCard).toContain('training-mode-card__spark')
    expect(trainingModeCard).toContain('training-mode-card__chip-text')
    expect(trainingModeCard).toContain('flex-wrap: wrap;')
    expect(trainingModeCard).toContain('max-width: 100%;')
    expect(trainingModeCard).toContain('min-width: 0;')
  })

  it('aligns achievement detail surfaces with the demo medal-board language', () => {
    const webAchievementPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/views/growth/GrowthAchievementsDetailView.vue'),
      'utf8'
    )
    const miniappAchievementPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/growth/achievements.vue'),
      'utf8'
    )
    const achievementBadgeList = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/growth/AchievementBadgeList.vue'),
      'utf8'
    )

    expect(webAchievementPage).toContain('achievement-page__eyebrow')
    expect(webAchievementPage).toContain('achievement-page__hero-card')
    expect(miniappAchievementPage).toContain('achievement-page__eyebrow')
    expect(miniappAchievementPage).toContain('achievement-page__hero-card')
    expect(achievementBadgeList).toContain('badge__medal')
    expect(achievementBadgeList).toContain('badge__shine')
    expect(achievementBadgeList).toContain('badge__status-pill')
  })

  it('aligns feedback and result surfaces with the demo celebration language', () => {
    const sessionFeedbackCard = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/SessionFeedbackCard.vue'),
      'utf8'
    )
    const feedbackPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/views/training/FeedbackPage.vue'),
      'utf8'
    )
    const miniappFeedbackPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/training/feedback.vue'),
      'utf8'
    )
    const resultCard = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/QuestionnaireResultCard.vue'),
      'utf8'
    )

    expect(sessionFeedbackCard).toContain('session-feedback-card__hero-badge')
    expect(sessionFeedbackCard).toContain('session-feedback-card__stats')
    expect(sessionFeedbackCard).toContain('session-feedback-card__score-tile')
    expect(sessionFeedbackCard).toContain('session-feedback-card__summary-tile')
    expect(sessionFeedbackCard).toContain('session-feedback-card__sticker')
    expect(sessionFeedbackCard).toContain('margin-top: 56rpx;')
    expect(feedbackPage).toContain('feedback-page__actions')
    expect(feedbackPage).toContain('feedback-page__secondary-action')
    expect(feedbackPage).toContain('margin-top: 1.75rem;')
    expect(miniappFeedbackPage).toContain('feedback-page__actions')
    expect(miniappFeedbackPage).toContain('margin-top: 40rpx;')
    expect(miniappFeedbackPage).not.toContain('<div class="flex gap-12">')
    expect(resultCard).toContain('result-card__hero-badge')
    expect(resultCard).toContain('result-card__summary-grid')
    expect(resultCard).toContain('result-card__score-tile')
    expect(resultCard).toContain('result-card__sticker')
    expect(resultCard).toContain('margin-top: 64rpx;')
  })

  it('routes every rounded questionnaire option through the short check-in surface only', () => {
    const shortQuestionnaireForm = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/training/ShortQuestionnaireForm.vue'),
      'utf8'
    )
    const longQuestionnaireForm = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/LongQuestionnaireForm.vue'),
      'utf8'
    )

    expect(shortQuestionnaireForm).toContain('rating-option rating-option--rounded')
    expect(shortQuestionnaireForm).toContain('short-questionnaire-form__options')
    expect(shortQuestionnaireForm).toContain('short-questionnaire-form__option')
    expect(longQuestionnaireForm).not.toContain('rating-option--rounded')
  })

  it('gives long-questionnaire prompts and actions more breathing room', () => {
    const longQuestionnaireForm = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/LongQuestionnaireForm.vue'),
      'utf8'
    )

    expect(longQuestionnaireForm).toContain('long-questionnaire-form__card')
    expect(longQuestionnaireForm).toContain('long-questionnaire-form__prompt')
    expect(longQuestionnaireForm).toContain('long-questionnaire-form__options')
    expect(longQuestionnaireForm).toContain('long-questionnaire-form__actions')
    expect(longQuestionnaireForm).toContain('gap: 40rpx;')
    expect(longQuestionnaireForm).toContain('margin-bottom: 40rpx;')
    expect(longQuestionnaireForm).toContain('padding-bottom: 72rpx;')
  })

  it('relaxes shared shell and entry-page spacing across the app', () => {
    const accessShell = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/AccessPageShell.vue'),
      'utf8'
    )
    const uniAccessShell = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/components/access/UniAccessPageShell.vue'),
      'utf8'
    )
    const uniTrainingShell = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/components/training/UniTrainingPageShell.vue'),
      'utf8'
    )
    const uniGrowthShell = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/components/growth/UniGrowthPageShell.vue'),
      'utf8'
    )
    const webHomePage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/views/training/HomePage.vue'),
      'utf8'
    )
    const miniappHomePage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/training/home.vue'),
      'utf8'
    )
    const webSelectPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/views/training/TrainingSelectionPage.vue'),
      'utf8'
    )
    const webGrowthPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/views/growth/GrowthCenterView.vue'),
      'utf8'
    )
    const miniappGrowthPage = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/pages/growth/index.vue'),
      'utf8'
    )

    expect(accessShell).toContain('padding: 56rpx 48rpx 216rpx;')
    expect(accessShell).toContain('gap: 56rpx;')
    expect(uniAccessShell).toContain('padding: 56rpx 48rpx 120rpx;')
    expect(uniAccessShell).toContain('gap: 40rpx;')
    expect(uniTrainingShell).toContain('padding: 56rpx 32rpx 96rpx;')
    expect(uniTrainingShell).toContain('gap: 36rpx;')
    expect(uniGrowthShell).toContain('padding: 56rpx 32rpx 96rpx;')
    expect(uniGrowthShell).toContain('gap: 40rpx;')
    expect(webHomePage).toContain('gap-22')
    expect(webHomePage).toContain('py-32')
    expect(webHomePage).toContain('margin-top: 1.5rem;')
    expect(miniappHomePage).toContain('gap: 28rpx;')
    expect(miniappHomePage).toContain('margin-top: 44rpx;')
    expect(webSelectPage).toContain('gap: 1.5rem;')
    expect(webSelectPage).toContain('padding: 2rem 1.25rem 2.5rem;')
    expect(webGrowthPage).toContain('gap: 1.5rem;')
    expect(webGrowthPage).toContain('padding: 1.75rem 1.25rem 2.5rem;')
    expect(miniappGrowthPage).toContain('gap: 28rpx;')
    expect(miniappGrowthPage).toContain('padding: 40rpx;')
  })

  it('wires the register avatar flow to WeChat avatar and image upload APIs', () => {
    const avatarField = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/components/access/RegistrationAvatarField.vue'),
      'utf8'
    )
    const avatarComposable = readFileSync(
      resolve('/Users/pi-dal/Developer/sport-snack/src/uni-app/composables/useRegistrationAvatar.ts'),
      'utf8'
    )

    expect(avatarField).toContain('open-type="chooseAvatar"')
    expect(avatarField).toContain('@chooseavatar=')
    expect(avatarComposable).toContain('detail?.avatarUrl')
    expect(avatarComposable).toContain('uni.chooseImage')
    expect(avatarComposable).toContain('sourceType: [source]')
    expect(avatarComposable).toContain('uni.uploadFile')
    expect(avatarComposable).toContain("name: 'file'")
  })
})
