<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { CheckpointKey } from '../../types/student'
import { evaluateLongQuestionnaire, type LongQuestion } from '../../features/access/questionnaire'
import { getRatingOptionClasses } from '../../features/questionnaire/ratingOptionStyles'

interface Props {
  checkpoint: CheckpointKey
  questions: LongQuestion[]
}

interface SubmissionPayload {
  responses: Record<string, number>
  score: number
  percentage: number
  submittedAt: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [payload: SubmissionPayload]
}>()

const responses = reactive<Record<string, number>>({})

for (const question of props.questions) {
  responses[question.id] = 0
}

const isComplete = computed(() => Object.values(responses).every((value) => value > 0))

function handleSubmit() {
  if (!isComplete.value) {
    return
  }

  const result = evaluateLongQuestionnaire(props.checkpoint, { ...responses })
  emit('submit', {
    responses: result.responses,
    score: result.score,
    percentage: result.percentage,
    submittedAt: result.submittedAt
  })
}

function handleResponseChange(questionId: string, value: number) {
  responses[questionId] = value
}

function optionClasses(isSelected: boolean) {
  return getRatingOptionClasses(isSelected, 'gold')
}
</script>

<template>
  <form class="long-questionnaire-form" @submit.prevent="handleSubmit">
    <view
      v-for="question in questions"
      :key="question.id"
      class="long-questionnaire-form__card bg-white rounded-[32rpx] border-4 border-brand-gold/20 chunky-shadow"
    >
      <text class="long-questionnaire-form__prompt block text-[36rpx] font-800 text-[#1A202C] tracking-tight">{{ question.prompt }}</text>
      
      <view class="long-questionnaire-form__options">
        <view v-for="value in 5" :key="value"
          class="long-questionnaire-form__option"
          @click="handleResponseChange(question.id, value)"
        >
          <view class="rating-option rating-option--circle mx-auto" :class="optionClasses(responses[question.id] === value)">
            {{ value }}
          </view>
        </view>
      </view>
    </view>

    <view class="long-questionnaire-form__actions">
      <button form-type="submit" class="btn-primary" :disabled="!isComplete">
        <text v-if="!isComplete">请先完成所有问题</text>
        <text v-else>提交答案 ✨</text>
      </button>
    </view>
  </form>
</template>

<style scoped>
@import '../../features/questionnaire/ratingOptionStyles.css';

.long-questionnaire-form {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

.long-questionnaire-form__card {
  display: flex;
  flex-direction: column;
  padding: 44rpx 40rpx;
}

.long-questionnaire-form__prompt {
  line-height: 1.3;
  margin-bottom: 40rpx;
}

.long-questionnaire-form__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.long-questionnaire-form__option {
  position: relative;
  display: flex;
  min-width: 0;
  flex: 1 1 0;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.long-questionnaire-form__actions {
  margin-top: 40rpx;
  padding-bottom: 72rpx;
}
</style>
