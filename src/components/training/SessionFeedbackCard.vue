<script setup lang="ts">
defineProps<{
  modalityLabel: string
  qualityScore: number
  summary: string
}>()
</script>

<template>
  <view class="card-shell session-feedback-card">
    <view class="session-feedback-card__hero">
      <view class="session-feedback-card__hero-badge">
        <text>🎉</text>
      </view>
      <view class="chip-soft bg-brand-leaf/15 text-[#065F46] border-2 border-brand-leaf/25">
        <text>Session completed</text>
      </view>
      <text class="block text-[56rpx] font-900 text-brand-ink tracking-tight">{{ modalityLabel }} feedback</text>
      <text class="block text-[36rpx] leading-snug text-slate-600 font-700">
        Completion is locked in. Quality feedback helps refine the next round.
      </text>
    </view>

    <view class="session-feedback-card__stats">
      <view class="session-feedback-card__score-tile">
        <text class="block text-[24rpx] uppercase tracking-widest text-white/60 font-800">Quality score</text>
        <text class="block mt-[20rpx] text-[84rpx] font-900 text-white">{{ qualityScore }}</text>
      </view>
      <view class="session-feedback-card__summary-tile">
        <text class="block text-[24rpx] uppercase tracking-widest text-[#2B7CB8] font-800">Encouragement</text>
        <text class="block mt-[16rpx] text-[32rpx] leading-snug text-brand-ink font-bold">{{ summary }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.session-feedback-card {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

.session-feedback-card__hero {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.session-feedback-card__hero-badge {
  display: inline-flex;
  width: 124rpx;
  height: 124rpx;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 8rpx solid #ffffff;
  background: rgba(255, 139, 139, 0.2);
  box-shadow: 0 12rpx 0 rgba(255, 139, 139, 0.16);
  font-size: 56rpx;
}

.session-feedback-card__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.session-feedback-card__score-tile,
.session-feedback-card__summary-tile {
  flex: 1 1 240rpx;
  min-width: 0;
  display: flex;
  min-height: 220rpx;
  flex-direction: column;
  justify-content: center;
  border-radius: 40rpx;
  padding: 32rpx;
}

.session-feedback-card__score-tile {
  background: #1A202C;
  box-shadow: 0 10rpx 0 rgba(26, 32, 44, 0.12);
}

.session-feedback-card__summary-tile {
  border: 6rpx solid rgba(255, 211, 132, 0.24);
  background: rgba(255, 211, 132, 0.22);
}
</style>
