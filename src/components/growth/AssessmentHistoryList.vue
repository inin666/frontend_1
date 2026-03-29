<script setup lang="ts">
import { computed } from 'vue'
import type { CheckpointKey, LongQuestionnaireState } from '../../types/student'

const props = defineProps<{
  questionnaires: Record<CheckpointKey, LongQuestionnaireState>
}>()

const orderedHistory = computed(() => {
  const order: CheckpointKey[] = ['baseline', 'week4', 'week8', 'week12']
  return order.map(checkpoint => props.questionnaires[checkpoint])
})
</script>

<template>
  <view class="assessment" aria-label="评估历史">
    <view class="assessment__list">
      <view v-for="checkpoint in orderedHistory" :key="checkpoint.checkpoint" class="assessment-item">
        <text class="assessment-item__name block">{{ checkpoint.checkpoint.toUpperCase() }}</text>
        <text class="assessment-item__result block">
          {{ checkpoint.completed ? `得分 ${checkpoint.score} · ${checkpoint.percentage}%` : '尚未完成' }}
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.assessment__list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.assessment-item {
  border-radius: 48rpx;
  border: 8rpx solid rgba(255, 211, 132, 0.2);
  padding: 32rpx 40rpx;
  background: #fff;
  box-shadow: 0 12rpx 0px rgba(0, 0, 0, 0.04);
}

.assessment-item__name {
  margin: 0;
  font-weight: 900;
  color: #1A202C;
  font-size: 32rpx;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.assessment-item__result {
  margin: 16rpx 0 0;
  font-size: 28rpx;
  color: #64748B;
  font-weight: 700;
}
</style>
