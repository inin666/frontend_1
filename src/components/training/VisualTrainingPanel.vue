<script setup lang="ts">
defineProps<{
  title: string
  coachLabel: string
  learnerLabel: string
}>()

const emit = defineEmits<{
  complete: []
  interrupt: []
}>()
</script>

<template>
  <view class="card-shell p-[40rpx]">
    <view class="flex items-center justify-between gap-[24rpx]">
      <view>
        <text class="block section-title">{{ title }}</text>
        <text class="block mt-[16rpx] text-[28rpx] leading-snug text-slate-600 font-700">
          Split-screen guidance mirrors the Mini Program camera flow.
        </text>
      </view>
      <view class="chip-soft bg-brand-coral/16 text-brand-coral">
        <text>AI overlay</text>
      </view>
    </view>

    <view class="visual-training-panel__surfaces mt-[40rpx]">
      <view class="visual-training-panel__surface rounded-[48rpx] bg-brand-ink p-[36rpx] text-white">
        <text class="block text-[24rpx] uppercase tracking-widest text-white/60 font-800">{{ coachLabel }}</text>
        <view class="mt-[28rpx] h-[440rpx] rounded-[40rpx] bg-white/10" />
      </view>
      <view class="visual-training-panel__surface rounded-[48rpx] bg-white p-[36rpx] ring-4 ring-slate-100">
        <text class="block text-[24rpx] uppercase tracking-widest text-slate-500 font-800">{{ learnerLabel }}</text>
        <view class="mt-[28rpx] h-[440rpx] rounded-[40rpx] bg-brand-teal/15" />
      </view>
    </view>

    <view class="mt-[40rpx] flex gap-[24rpx]">
      <button
        class="flex-1 rounded-full border-none bg-brand-teal h-[108rpx] px-[32rpx] text-[30rpx] font-900 text-brand-ink shadow-[0_8rpx_0px_#5EA8D6] active:translate-y-[4rpx] active:shadow-[0_4rpx_0px_#5EA8D6] transition-transform flex items-center justify-center"
        type="button"
        @click="emit('complete')"
      >
        <text>Finish session</text>
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

<style scoped>
.visual-training-panel__surfaces {
  display: flex;
  flex-wrap: wrap;
  gap: 28rpx;
}

.visual-training-panel__surface {
  flex: 1 1 280rpx;
  min-width: 0;
}
</style>
