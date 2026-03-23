<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SessionFeedbackCard from '../../components/training/SessionFeedbackCard.vue'
import { useStudentAppState } from '../../composables/useStudentAppState'

const route = useRoute()
const router = useRouter()
const { state, refreshReminderEligibility } = useStudentAppState()

const session = computed(() => {
  if (route.params.sessionId === 'latest') {
    return state.sessions.at(-1) ?? null
  }

  return state.sessions.find(item => item.id === route.params.sessionId) ?? null
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

refreshReminderEligibility()
</script>

<template>
  <main class="feedback-page">
    <SessionFeedbackCard
      :modality-label="modalityLabel"
      :quality-score="session?.analysis.qualityScore ?? 0"
      :summary="session?.analysis.summary ?? 'Great work finishing the guided flow.'"
    />

    <div class="feedback-page__actions">
      <button
        class="btn-primary feedback-page__primary-action"
        type="button"
        @click="router.push('/home')"
      >
        Back home
      </button>
      <button
        class="btn-secondary feedback-page__secondary-action"
        type="button"
        @click="router.push('/growth')"
      >
        Growth center
      </button>
    </div>
  </main>
</template>

<style scoped>
.feedback-page {
  margin: 0 auto;
  display: flex;
  min-height: 100vh;
  max-width: 420px;
  flex-direction: column;
  gap: 1.125rem;
  padding: 1.5rem 1.25rem;
}

.feedback-page__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feedback-page__primary-action,
.feedback-page__secondary-action {
  width: 100%;
}
</style>
