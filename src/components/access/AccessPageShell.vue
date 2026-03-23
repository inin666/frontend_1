<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  chip?: string
}

defineProps<Props>()
</script>

<template>
  <view class="access-shell">
    <view class="access-shell__halo access-shell__halo--gold" />
    <view class="access-shell__halo access-shell__halo--teal" />

    <view class="access-shell__inner">
      <view class="access-shell__hero">
        <view class="access-shell__hero-badge">
          <text class="access-shell__hero-emoji">{{ chip ? '🎯' : '🏃‍♂️' }}</text>
        </view>

        <view class="access-shell__title-card">
          <view class="access-shell__title-top">
            <view class="access-shell__chip-pill">
              <text>{{ chip || 'Sports Snack' }}</text>
            </view>
            <view class="access-shell__spark-pill">
              <text>Play Mode</text>
            </view>
          </view>

          <text class="access-shell__title">{{ title }}</text>
          <text class="access-shell__subtitle">{{ subtitle }}</text>
        </view>
      </view>

      <view class="access-shell__body">
        <slot />
      </view>
    </view>
  </view>
</template>

<style scoped>
.access-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #FCF7F0;
  padding: 48rpx 48rpx 192rpx;
}

.access-shell__halo {
  position: absolute;
  border-radius: 9999px;
  pointer-events: none;
}

.access-shell__halo--gold {
  top: -88rpx;
  right: -36rpx;
  width: 240rpx;
  height: 240rpx;
  background: rgba(255, 211, 132, 0.28);
}

.access-shell__halo--teal {
  top: 240rpx;
  left: -72rpx;
  width: 200rpx;
  height: 200rpx;
  background: rgba(137, 207, 255, 0.2);
}

.access-shell__inner {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  display: flex;
  max-width: 960rpx;
  flex-direction: column;
  gap: 40rpx;
}

.access-shell__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28rpx;
  text-align: center;
}

.access-shell__hero-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 176rpx;
  height: 176rpx;
  border: 8rpx solid #ffffff;
  border-radius: 9999px;
  background: linear-gradient(180deg, #FFD384 0%, #FFC46A 100%);
  box-shadow: 0 16rpx 0 rgba(255, 211, 132, 0.35);
}

.access-shell__hero-emoji {
  font-size: 76rpx;
}

.access-shell__title-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 40rpx 36rpx;
  border: 8rpx solid rgba(255, 211, 132, 0.35);
  border-radius: 52rpx;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14rpx 0 rgba(0, 0, 0, 0.05);
}

.access-shell__title-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16rpx;
}

.access-shell__chip-pill,
.access-shell__spark-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 24rpx;
  border-radius: 9999px;
  font-size: 24rpx;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.access-shell__chip-pill {
  border: 4rpx solid rgba(255, 211, 132, 0.3);
  background: rgba(255, 211, 132, 0.18);
  color: #D97706;
}

.access-shell__spark-pill {
  border: 4rpx solid rgba(137, 207, 255, 0.3);
  background: rgba(137, 207, 255, 0.14);
  color: #2B7CB8;
}

.access-shell__title {
  display: block;
  margin: 0;
  color: #1A202C;
  font-size: 84rpx;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.access-shell__subtitle {
  display: block;
  margin: 0;
  color: #64748B;
  font-size: 38rpx;
  line-height: 1.5;
  font-weight: 800;
}

.access-shell__body {
  position: relative;
  z-index: 1;
}
</style>
