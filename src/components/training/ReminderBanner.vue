<script setup lang="ts">
defineProps<{
  visible: boolean
}>()
</script>

<template>
  <view
    v-if="visible"
    class="card-shell reminder-banner border-[8rpx] border-brand-gold/30 bg-brand-gold/10 text-brand-ink"
  >
    <view class="reminder-banner__eyebrow text-[36rpx] font-900 tracking-[0.16em] uppercase">
      <text>提醒回归</text>
    </view>
    <text class="block mt-[16rpx] text-[32rpx] leading-snug font-700">
      你已响应18:00提醒返回，再完成一次简短训练即可保持今日进度。
    </text>
  </view>
</template>

<style scoped>
.reminder-banner {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.reminder-banner__eyebrow {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  padding: 12rpx 20rpx;
  border-radius: 9999px;
  border: 4rpx solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.28);
  color: #B45309;
  font-size: 28rpx;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
</style>
