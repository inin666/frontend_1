<script setup lang="ts">
import { reactive, computed } from 'vue'
import {
  getRatingOptionClasses,
  type RatingOptionPalette
} from '../../features/questionnaire/ratingOptionStyles'

const emit = defineEmits<{
  submit: [payload: { energyLevel: number; confidence: number; enjoyment: number }]
}>()

const form = reactive({
  energyLevel: 0,
  confidence: 0,
  enjoyment: 0
})

const isComplete = computed(() => {
  return form.energyLevel > 0 && form.confidence > 0 && form.enjoyment > 0
})

function handleFieldChange(field: keyof typeof form, value: number) {
  form[field] = value
}

function optionClasses(isSelected: boolean, palette: RatingOptionPalette) {
  return getRatingOptionClasses(isSelected, palette)
}
</script>

<template>
  <form
    class="flex flex-col gap-[32rpx]"
    @submit.prevent="emit('submit', { ...form })"
  >
    <view class="bg-white p-[40rpx] rounded-[36rpx] border-4 border-brand-teal/20 chunky-shadow text-center mb-[12rpx]">
      <view class="inline-flex items-center justify-center p-[20rpx] rounded-full bg-brand-teal/15 text-[#4A90E2] mb-[20rpx] border-4 border-brand-teal/25">
        <text class="text-[56rpx]">🙂</text>
      </view>
      <text class="block text-[44rpx] font-800 tracking-tight text-[#1A202C]">训练后打卡</text>
      <text class="block mt-[12rpx] text-[30rpx] font-700 text-[#64748B]">
        在反馈出现前，记录本次训练的感受。
      </text>
    </view>

    <!-- 能量水平 -->
    <view class="bg-white rounded-[32rpx] p-[40rpx] border-4 border-brand-gold/20 chunky-shadow">
      <view class="text-[36rpx] font-800 text-[#1A202C] leading-snug mb-[28rpx] tracking-tight flex items-center gap-[12rpx]">
        <text class="text-[#FFD384]">⚡</text>
        <text>精力水平</text>
      </view>
      <view class="short-questionnaire-form__options">
        <view v-for="val in 5" :key="val" class="short-questionnaire-form__option" @click="handleFieldChange('energyLevel', val)">
          <view class="rating-option rating-option--rounded" :class="optionClasses(form.energyLevel === val, 'gold')">
            {{ val }}
          </view>
        </view>
      </view>
    </view>

    <!-- 信心 -->
    <view class="bg-white rounded-[32rpx] p-[40rpx] border-4 border-brand-teal/20 chunky-shadow">
      <view class="text-[36rpx] font-800 text-[#1A202C] leading-snug mb-[28rpx] tracking-tight flex items-center gap-[12rpx]">
        <text class="text-[#4A90E2]">✔️</text>
        <text>运动信心</text>
      </view>
      <view class="short-questionnaire-form__options">
        <view v-for="val in 5" :key="val" class="short-questionnaire-form__option" @click="handleFieldChange('confidence', val)">
          <view class="rating-option rating-option--rounded" :class="optionClasses(form.confidence === val, 'blue')">
            {{ val }}
          </view>
        </view>
      </view>
    </view>

    <!-- 乐趣 -->
    <view class="bg-white rounded-[32rpx] p-[40rpx] border-4 border-brand-coral/20 chunky-shadow">
      <view class="text-[36rpx] font-800 text-[#1A202C] leading-snug mb-[28rpx] tracking-tight flex items-center gap-[12rpx]">
        <text class="text-[#FF6B6B]">❤️</text>
        <text>乐趣</text>
      </view>
      <view class="short-questionnaire-form__options">
        <view v-for="val in 5" :key="val" class="short-questionnaire-form__option" @click="handleFieldChange('enjoyment', val)">
          <view class="rating-option rating-option--rounded" :class="optionClasses(form.enjoyment === val, 'coral')">
            {{ val }}
          </view>
        </view>
      </view>
    </view>

    <view class="mt-[20rpx] pb-[48rpx]">
      <button class="btn-primary" form-type="submit" :disabled="!isComplete">
        <text v-if="!isComplete">Incomplete</text>
        <text v-else>Continue ✨</text>
      </button>
    </view>
  </form>
</template>

<style scoped>
@import '../../features/questionnaire/ratingOptionStyles.css';

.short-questionnaire-form__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8rpx;
  padding-inline: 4rpx;
}

.short-questionnaire-form__option {
  display: flex;
  min-width: 0;
  flex: 1 1 0;
  justify-content: center;
}
</style>
