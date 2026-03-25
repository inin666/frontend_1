<script setup lang="ts">
import { computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import DailyProgressCard from '../../../components/training/DailyProgressCard.vue'
import ReminderBanner from '../../../components/training/ReminderBanner.vue'
import UniTrainingPageShell from '../../components/training/UniTrainingPageShell.vue'
import { useStudentStore } from '../../composables/useStudentStore'
import { resolveReminderSource } from '../../platform/reminders'

const store = useStudentStore()

const showReminderBanner = computed(() => {
  const snapshot = store.getSnapshot()
  return snapshot.reminderSource === 'wechat-reminder' && snapshot.dailyAdherence.validCheckIns < 3
})

onLoad((query) => {
  const nextQuery = query ?? {}
  const reminderSource = resolveReminderSource({
    source: nextQuery.source?.toString()
  })

  if (reminderSource) {
    store.setReminderSource(reminderSource)
  }
})

onShow(() => {
  store.refreshReminderEligibility()
})

</script>

<template>
  <UniTrainingPageShell>
    <ReminderBanner :visible="showReminderBanner" />

    <view class="card-shell home-page__hero">
      <view class="home-page__hero-tag">
        <text>每日中心</text>
      </view>
      <text class="section-title">选择下一个训练</text>
      <text class="home-page__hero-copy">
        选择一个有趣的训练，完成它，保持你的连续记录。
      </text>
    </view>

    <DailyProgressCard
      :qualifying-days="store.state.weeklyAdherence.qualifyingDays"
      :reminder-eligible="store.state.dailyAdherence.reminderEligible"
      :valid-check-ins="store.state.dailyAdherence.validCheckIns"
    />

    <view class="card-shell p-[40rpx]">
      <view class="home-page__hero-tag home-page__hero-tag--teal">
        <text>快捷操作</text>
      </view>
      <text class="block section-title mt-[20rpx]">选择下一个训练</text>
      <text class="block mt-[20rpx] text-[34rpx] leading-8 text-slate-600 font-700">
        武术、HIIT 和楼梯训练可自由组合，每完成一次引导训练都计入进度。
      </text>

      <view class="home-page__actions">
        <navigator
          class="home-action home-action--primary"
          hover-class="home-action--pressed"
          url="/pages/training/select"
        >
          <text>开始训练</text>
        </navigator>
        <navigator
          class="home-action home-action--secondary"
          hover-class="home-action--pressed"
          url="/pages/growth/index"
        >
          <text>打开成长</text>
        </navigator>
      </view>
    </view>
  </UniTrainingPageShell>
</template>

<style scoped>
.home-page__hero {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.home-page__hero-tag {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  padding: 12rpx 22rpx;
  border-radius: 9999px;
  border: 4rpx solid rgba(255, 211, 132, 0.24);
  background: rgba(255, 211, 132, 0.14);
  color: #D97706;
  font-size: 24rpx;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.home-page__hero-tag--teal {
  border-color: rgba(137, 207, 255, 0.24);
  background: rgba(137, 207, 255, 0.14);
  color: #2B7CB8;
}

.home-page__hero-copy {
  display: block;
  color: #64748B;
  font-size: 34rpx;
  line-height: 1.5;
  font-weight: 700;
}

.home-page__actions {
  margin-top: 44rpx;
  display: flex;
  gap: 24rpx;
}

.home-action {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 108rpx;
  border-radius: 9999px;
  padding: 16rpx 24rpx;
  font-size: 32rpx;
  line-height: 1.3;
  text-align: center;
  font-weight: 900;
  transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
}

.home-action--primary {
  background: #FF8B8B;
  color: white;
  box-shadow: 0 8rpx 0 #DE6E6E;
}

.home-action--primary:active {
  transform: translateY(4rpx);
  box-shadow: 0 4rpx 0 #DE6E6E;
}

.home-action--secondary {
  background: white;
  color: #1A202C;
  border: 6rpx solid #FFEAC2;
  box-shadow: 0 8rpx 0 rgba(0, 0, 0, 0.04);
}

.home-action--secondary:active {
  transform: translateY(4rpx);
  box-shadow: 0 4rpx 0 rgba(0, 0, 0, 0.04);
}

.home-action--pressed {
  transform: translateY(4rpx);
}
</style>
