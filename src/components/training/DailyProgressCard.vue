<script setup lang="ts">
const props = defineProps<{
  validCheckIns: number
  qualifyingDays: number
  reminderEligible: boolean
}>()

const progressSegments = [1, 2, 3]
</script>

<template>
  <view class="card-shell progress-card">
    <view class="progress-card__header">
      <view class="progress-card__copy">
        <view class="progress-card__eyebrow">
          <text>每日任务记录</text>
        </view>
        <text class="block section-title">今日能量循环</text>
        <text class="block mt-[20rpx] text-[34rpx] leading-8 text-slate-600 font-700">
          今日最多完成三次有效打卡以保持连续记录。
        </text>
      </view>

      <view class="progress-card__meter-pill px-[32rpx] py-[20rpx] text-[40rpx] font-900">
        {{ props.validCheckIns }}/3
      </view>
    </view>

    <view class="mt-[36rpx] flex gap-[20rpx]">
      <view
        v-for="segment in progressSegments"
        :key="segment"
        class="h-[32rpx] flex-1 rounded-full"
        :class="segment <= props.validCheckIns ? 'bg-brand-teal' : 'bg-slate-200'"
      />
    </view>

    <view class="mt-[36rpx] flex flex-wrap items-center gap-[24rpx] text-[28rpx] text-slate-600 font-700">
      <view class="chip-soft bg-brand-teal/15 text-brand-ink border-2 border-brand-teal/25">
        <text>本周达标天数：{{ props.qualifyingDays }}</text>
      </view>
      <view
        class="chip-soft"
        :class="props.reminderEligible ? 'bg-brand-gold/20 text-brand-ink border-2 border-brand-gold/30' : 'bg-slate-100 text-slate-500 border-2 border-slate-200'"
      >
        <text>{{ props.reminderEligible ? '18:00提醒仍在进行' : '今日目标已完成' }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.progress-card {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.progress-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.progress-card__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.progress-card__eyebrow {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  padding: 12rpx 20rpx;
  border: 4rpx solid rgba(255, 211, 132, 0.24);
  border-radius: 9999px;
  background: rgba(255, 211, 132, 0.14);
  color: #D97706;
  font-size: 24rpx;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.progress-card__meter-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 32rpx;
  border: 4rpx solid rgba(255, 139, 139, 0.2);
  border-radius: 9999px;
  background: rgba(255, 139, 139, 0.12);
  box-shadow: 0 6rpx 0 rgba(255, 139, 139, 0.14);
  color: #FF8B8B;
  font-size: 40rpx;
  font-weight: 900;
  white-space: nowrap;
}
</style>
