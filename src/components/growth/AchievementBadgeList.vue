<script setup lang="ts">
import type { GrowthAchievement } from '../../features/growth/summary'

defineProps<{
  achievements: GrowthAchievement[]
}>()

function badgeEmoji(id: string) {
  if (id === 'starter') {
    return '🚀'
  }

  if (id === 'momentum') {
    return '🔥'
  }

  return '🧭'
}
</script>

<template>
  <view class="badge-grid" aria-label="Achievement badges">
    <view
      v-for="badge in achievements"
      :key="badge.id"
      :class="badge.earned ? 'badge badge--earned' : 'badge badge--locked'"
    >
      <view v-if="badge.earned" class="badge__shine" />
      <view class="badge__medal">
        <text class="badge__emoji">{{ badgeEmoji(badge.id) }}</text>
      </view>
      <view class="badge__status-pill" :class="badge.earned ? 'badge__status-pill--earned' : ''">
        <text>{{ badge.earned ? 'Earned' : 'Locked' }}</text>
      </view>
      <text class="badge__title">{{ badge.title }}</text>
      <text class="badge__description">{{ badge.description }}</text>
    </view>
  </view>
</template>

<style scoped>
.badge-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 32rpx;
}

.badge {
  position: relative;
  flex: 1 1 360rpx;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18rpx;
  border-radius: 48rpx;
  padding: 40rpx;
  text-align: center;
  overflow: hidden;
}

.badge--earned {
  background: #fff;
  border: 8rpx solid rgba(255, 211, 132, 0.3);
  box-shadow: 0 12rpx 0px rgba(0, 0, 0, 0.05);
}

.badge--locked {
  background: rgba(241, 245, 249, 0.5);
  border: 8rpx dashed #e2e8f0;
  opacity: 0.65;
}

.badge__shine {
  position: absolute;
  top: -32rpx;
  right: -24rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 9999px;
  background: rgba(255, 211, 132, 0.24);
}

.badge__medal {
  display: inline-flex;
  width: 128rpx;
  height: 128rpx;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 8rpx solid #ffffff;
  background: rgba(255, 211, 132, 0.22);
  box-shadow: 0 12rpx 0 rgba(255, 211, 132, 0.16);
}

.badge__emoji {
  font-size: 56rpx;
}

.badge__status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 24rpx;
  border-radius: 9999px;
  background: #f1f5f9;
  color: #94A3B8;
  font-size: 24rpx;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.badge__status-pill--earned {
  color: #065F46;
  background: rgba(168, 230, 207, 0.22);
}

.badge__title {
  display: block;
  margin: 0;
  font-weight: 900;
  font-size: 36rpx;
  color: #1A202C;
}

.badge__description {
  display: block;
  font-size: 26rpx;
  color: #64748B;
  font-weight: 600;
}
</style>
