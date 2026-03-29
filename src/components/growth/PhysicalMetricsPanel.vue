<script setup lang="ts">
import { computed } from 'vue'
import type { PhysicalMetricsState } from '../../features/growth/summary'

const props = defineProps<{
  metricsState: PhysicalMetricsState
}>()

function hasPhysicalMetrics(
  metricsState: PhysicalMetricsState
): metricsState is Extract<PhysicalMetricsState, { hasMetrics: true }> {
  return metricsState.hasMetrics
}

const hasMetrics = computed(() => props.metricsState.hasMetrics)
const emptyMessage = computed(() => hasPhysicalMetrics(props.metricsState) ? '' : props.metricsState.message)
const metrics = computed(() => hasPhysicalMetrics(props.metricsState) ? props.metricsState.metrics : [])
</script>

<template>
  <view class="metrics" aria-label="身体指标面板">
    <text v-if="!hasMetrics" class="metrics__empty">{{ emptyMessage }}</text>

    <view v-for="metric in metrics" :key="metric.label" class="metric-card">
      <view class="metric-card__header">
        <text class="metric-card__label">{{ metric.label }}</text>
        <text class="metric-card__unit">{{ metric.unit }}</text>
      </view>

      <view class="metric-card__trend" aria-label="指标趋势值">
        <text v-for="(value, index) in metric.values" :key="index" class="metric-card__point">
          {{ value }}
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.metrics {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.metrics__empty {
  display: block;
  margin: 0;
  padding: 40rpx;
  border-radius: 48rpx;
  background: rgba(255, 211, 132, 0.06);
  color: #64748B;
  border: 8rpx dashed rgba(255, 211, 132, 0.3);
  font-weight: 600;
  font-size: 28rpx;
}

.metric-card {
  border: 8rpx solid rgba(255, 211, 132, 0.2);
  border-radius: 48rpx;
  padding: 40rpx;
  background: #fff;
  box-shadow: 0 12rpx 0px rgba(0, 0, 0, 0.04);
}

.metric-card__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16rpx;
}

.metric-card__label {
  margin: 0;
  color: #1A202C;
  font-size: 32rpx;
  font-weight: 900;
}

.metric-card__unit {
  color: #64748B;
  font-size: 24rpx;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-card__trend {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
  margin: 24rpx 0 0;
  padding: 0;
}

.metric-card__point {
  border-radius: 999px;
  background: rgba(137, 207, 255, 0.15);
  color: #1A202C;
  padding: 8rpx 24rpx;
  font-size: 26rpx;
  font-weight: 700;
}
</style>
