<script setup lang="ts">
import TrainingModeCard from '../../../components/training/TrainingModeCard.vue'
import type { TrainingModality } from '../../../domain/student/types'
import UniTrainingPageShell from '../../components/training/UniTrainingPageShell.vue'

function chooseMode(modality: TrainingModality) {
  if (modality === 'stair') {
    void uni.navigateTo({
      url: '/pages/training/stair-session'
    })
    return
  }

  void uni.navigateTo({
    url: `/pages/training/visual-session?modality=${modality}`
  })
}
</script>

<template>
  <UniTrainingPageShell>
    <view class="card-shell select-page__hero-card">
      <view class="select-page__hero-tag">
        <text>训练游乐场</text>
      </view>
      <view class="select-page__hero-sticker">
        <text>🎮</text>
      </view>
      <text class="section-title">选择你的训练</text>
      <text class="select-page__hero-copy text-17 leading-7 text-slate-600">
        选择一个有趣的训练模式，每个卡片都像一个小游戏，而不是普通的表单步骤。
      </text>
    </view>

    <TrainingModeCard
      accent-class="bg-brand-coral/16 text-brand-coral"
      description="摄像头引导的武术动作，分屏反馈。"
      modality="wushu"
      title="武术"
      @choose="chooseMode"
    />
    <TrainingModeCard
      accent-class="bg-brand-gold/22 text-brand-ink"
      description="快速有节奏的间歇训练，带实时摄像头占位。"
      modality="hiit"
      title="HIIT"
      @choose="chooseMode"
    />
    <TrainingModeCard
      accent-class="bg-brand-teal/16 text-brand-ink"
      description="30秒的运动传感器爆发，用于楼梯训练。"
      modality="stair"
      title="楼梯训练"
      @choose="chooseMode"
    />
  </UniTrainingPageShell>
</template>

<style scoped>
.select-page__hero-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  overflow: hidden;
}

.select-page__hero-tag {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  padding: 12rpx 24rpx;
  border-radius: 9999px;
  border: 4rpx solid rgba(137, 207, 255, 0.26);
  background: rgba(137, 207, 255, 0.14);
  color: #2B7CB8;
  font-size: 24rpx;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.select-page__hero-sticker {
  position: absolute;
  top: 28rpx;
  right: 28rpx;
  display: inline-flex;
  width: 112rpx;
  height: 112rpx;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 6rpx solid #ffffff;
  background: rgba(255, 211, 132, 0.9);
  box-shadow: 0 12rpx 0 rgba(255, 211, 132, 0.28);
  font-size: 52rpx;
}

.select-page__hero-copy {
  display: block;
  max-width: 520rpx;
  color: #64748B;
  font-size: 32rpx;
  line-height: 1.55;
  font-weight: 700;
}
</style>
