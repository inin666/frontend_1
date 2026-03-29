<script setup lang="ts">
import { computed } from 'vue'
import type { GrowthCalendarDay } from '../../features/growth/summary'

const props = defineProps<{
  days: GrowthCalendarDay[]
}>()

const groupedWeeks = computed(() => {
  const weeks: GrowthCalendarDay[][] = []
  let activeWeek: GrowthCalendarDay[] = []

  props.days.forEach(day => {
    activeWeek.push(day)
    if (activeWeek.length === 7) {
      weeks.push(activeWeek)
      activeWeek = []
    }
  })

  if (activeWeek.length > 0) {
    weeks.push(activeWeek)
  }

  return weeks
})

function cellClass(day: GrowthCalendarDay): string {
  if (day.status === 'met-goal') {
    return 'adherence-cell adherence-cell--met'
  }

  if (day.status === 'partial') {
    return 'adherence-cell adherence-cell--partial'
  }

  return 'adherence-cell adherence-cell--none'
}
</script>

<template>
  <view class="adherence" aria-label="坚持热力图">
    <view v-for="(week, weekIndex) in groupedWeeks" :key="weekIndex" class="adherence-week">
      <view
        v-for="day in week"
        :key="day.date"
        :class="cellClass(day)"
        :title="`${day.date}：已完成 ${day.completedSessions} 次训练`"
      />
    </view>
  </view>
</template>

<style scoped>
.adherence {
  display: flex;
  gap: 16rpx;
  overflow-x: auto;
  padding-bottom: 8rpx;
}

.adherence-week {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.adherence-cell {
  width: 32rpx;
  height: 32rpx;
  border-radius: 9999px;
}

.adherence-cell--met {
  background: #FF8B8B;
}

.adherence-cell--partial {
  background: rgba(255, 139, 139, 0.35);
}

.adherence-cell--none {
  background: #f1f5f9;
}
</style>
