<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import SessionFeedbackCard from '../../../components/training/SessionFeedbackCard.vue'
import UniTrainingPageShell from '../../components/training/UniTrainingPageShell.vue'
import { useStudentStore } from '../../composables/useStudentStore'

const store = useStudentStore()
const sessionId = ref('latest')

onLoad((query) => {
  const nextQuery = query ?? {}
  sessionId.value = nextQuery.sessionId?.toString() ?? 'latest'
})

onShow(() => {
  store.refreshReminderEligibility()
})

const session = computed(() => {
  const snapshot = store.getSnapshot()
  if (sessionId.value === 'latest') {
    return snapshot.sessions.at(-1) ?? null
  }

  return snapshot.sessions.find(item => item.id === sessionId.value) ?? null
})

const modalityLabel = computed(() => {
  if (!session.value) {
    return 'Session'
  }

  return session.value.modality === 'stair'
    ? 'Stair-climbing'
    : session.value.modality === 'hiit'
      ? 'HIIT'
      : 'Wushu'
})

function goHome() {
  void uni.redirectTo({
    url: '/pages/training/home'
  })
}

function goGrowthCenter() {
  void uni.redirectTo({
    url: '/pages/growth/index'
  })
}
</script>

<template>
  <UniTrainingPageShell>
    <SessionFeedbackCard
      :modality-label="modalityLabel"
      :quality-score="session?.analysis.qualityScore ?? 0"
      :summary="session?.analysis.summary ?? 'Great work finishing the guided flow.'"
    />

    <view class="feedback-page__actions">
      <button
        class="btn-primary feedback-page__primary-action"
        type="button"
        @click="goHome"
      >
        <text>Back home</text>
      </button>
      <button
        class="btn-secondary feedback-page__secondary-action"
        type="button"
        @click="goGrowthCenter"
      >
        <text>Growth center</text>
      </button>
    </view>
  </UniTrainingPageShell>
</template>

<style scoped>
.feedback-page__actions {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-top: 40rpx;
}

.feedback-page__primary-action,
.feedback-page__secondary-action {
  width: 100%;
}
</style>
