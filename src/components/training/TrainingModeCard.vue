<script setup lang="ts">
import { computed } from 'vue'
import type { TrainingModality } from '../../types/student'

const props = defineProps<{
  modality: TrainingModality
  title: string
  description: string
  accentClass: string
}>()

const emit = defineEmits<{
  choose: [modality: TrainingModality]
}>()

const modeMeta = computed(() => {
  if (props.modality === 'wushu') {
    return {
      emoji: '🥋',
      kicker: '武术挑战',
      cta: '开启引导',
      chipBackground: '#FF8B8B',
      chipColor: '#FFFFFF'
    }
  }

  if (props.modality === 'hiit') {
    return {
      emoji: '⚡',
      kicker: '节奏冲刺',
      cta: '开始爆发',
      chipBackground: '#FFD384',
      chipColor: '#1A202C'
    }
  }

  return {
    emoji: '🪜',
    kicker: '阶梯冲刺',
    cta: '立即攀登',
    chipBackground: '#89CFFF',
    chipColor: '#1A202C'
  }
})

function handleChoose() {
  emit('choose', props.modality)
}
</script>

<template>
  <view
    class="training-mode-card card-shell w-full cursor-pointer p-[48rpx] text-left bouncy-btn"
    hover-class="training-mode-card--pressed"
    @click="handleChoose"
  >
    <view class="training-mode-card__topline">
      <view class="training-mode-card__sticker" :class="props.accentClass">
        <text class="training-mode-card__sticker-emoji">{{ modeMeta.emoji }}</text>
      </view>
      <view class="training-mode-card__spark">
        <text>{{ modeMeta.kicker }}</text>
      </view>
    </view>

    <view
      class="chip-soft training-mode-card__chip border-2"
      :style="{ backgroundColor: modeMeta.chipBackground, color: modeMeta.chipColor }"
    >
      <text class="training-mode-card__chip-text">{{ props.title }} 快餐</text>
    </view>
    <text class="block text-[40rpx] font-900 text-brand-ink tracking-[-0.03em]">{{ props.title }}</text>
    <text class="block text-[32rpx] leading-snug text-slate-600 font-700">{{ props.description }}</text>

    <view class="training-mode-card__footer">
      <view class="training-mode-card__cta">
        <text>{{ modeMeta.cta }}</text>
      </view>
      <text class="training-mode-card__hint">1个简短引导课程</text>
    </view>
  </view>
</template>

<style scoped>
.training-mode-card {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: 320rpx;
  flex-direction: column;
  justify-content: center;
  gap: 12rpx;
  border-bottom-width: 12rpx !important;
  overflow: hidden;
}

.training-mode-card__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 8rpx;
}

.training-mode-card__sticker {
  display: inline-flex;
  width: 92rpx;
  height: 92rpx;
  flex: none;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 6rpx solid #ffffff;
  box-shadow: 0 10rpx 0 rgba(0, 0, 0, 0.04);
}

.training-mode-card__sticker-emoji {
  font-size: 42rpx;
}

.training-mode-card__spark {
  display: inline-flex;
  max-width: 100%;
  width: fit-content;
  align-items: center;
  justify-content: center;
  padding: 12rpx 18rpx;
  border-radius: 9999px;
  border: 4rpx solid rgba(255, 211, 132, 0.24);
  background: rgba(255, 211, 132, 0.14);
  color: #D97706;
  font-size: 22rpx;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.training-mode-card__chip {
  align-self: flex-start;
  max-width: 100%;
}

.training-mode-card__chip-text {
  display: block;
  color: inherit;
}

.training-mode-card__footer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-top: 16rpx;
  min-width: 0;
}

.training-mode-card__cta {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  padding: 12rpx 24rpx;
  border-radius: 9999px;
  background: #1A202C;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  box-shadow: 0 8rpx 0 rgba(26, 32, 44, 0.16);
}

.training-mode-card__hint {
  display: block;
  flex: 1 1 100%;
  min-width: 0;
  color: #94A3B8;
  font-size: 24rpx;
  font-weight: 800;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  word-break: break-word;
}

.training-mode-card--pressed {
  transform: translateY(4rpx);
  box-shadow: none;
}
</style>
