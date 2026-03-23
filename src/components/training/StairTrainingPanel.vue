<script setup lang="ts">
defineProps<{
  secondsLeft: number
}>()

const emit = defineEmits<{
  start: []
  complete: []
  interrupt: []
}>()
</script>

<template>
  <view class="card-shell p-[40rpx]">
    <view class="flex items-center justify-between gap-[24rpx]">
      <view>
        <text class="block section-title">Stair-climb burst</text>
        <text class="block mt-[16rpx] text-[28rpx] leading-snug text-slate-600 font-700">
          30-second sensor capture with motion-only placeholders.
        </text>
      </view>
      <view class="chip-soft bg-brand-teal/16 text-brand-ink">
        <text>Sensor ready</text>
      </view>
    </view>

    <view class="mt-[44rpx] flex justify-center">
      <view class="flex h-[360rpx] w-[360rpx] items-center justify-center rounded-full bg-brand-ink text-center text-white shadow-[0_16rpx_40rpx_rgba(34,48,74,0.18)] border-[16rpx] border-white ring-4 ring-brand-ink/10">
        <view>
          <text class="block text-[24rpx] uppercase tracking-widest text-white/65 font-800">Seconds left</text>
          <text class="block mt-[24rpx] text-[108rpx] font-900 leading-none">{{ secondsLeft }}</text>
        </view>
      </view>
    </view>

    <view class="mt-[40rpx] flex gap-[24rpx]">
      <button
        class="flex-1 rounded-full border-none bg-brand-gold h-[108rpx] px-[32rpx] text-[30rpx] font-900 text-brand-ink shadow-[0_8rpx_0px_#D4A84A] active:translate-y-[4rpx] active:shadow-[0_4rpx_0px_#D4A84A] transition-transform flex items-center justify-center"
        type="button"
        @click="emit('start')"
      >
        <text>Start Flow</text>
      </button>
      <button
        class="rounded-full border-none bg-brand-teal h-[108rpx] px-[40rpx] text-[30rpx] font-900 text-brand-ink shadow-[0_8rpx_0px_#5EA8D6] active:translate-y-[4rpx] active:shadow-[0_4rpx_0px_#5EA8D6] transition-transform flex items-center justify-center"
        type="button"
        @click="emit('complete')"
      >
        <text>Complete</text>
      </button>
      <button
        class="rounded-full border-none bg-slate-100 h-[108rpx] px-[40rpx] text-[30rpx] font-800 text-slate-600 shadow-[0_8rpx_0px_rgba(0,0,0,0.05)] active:translate-y-[4rpx] active:shadow-none transition-transform flex items-center justify-center"
        type="button"
        @click="emit('interrupt')"
      >
        <text>Exit</text>
      </button>
    </view>
  </view>
</template>
