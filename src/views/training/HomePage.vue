<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import DailyProgressCard from '../../components/training/DailyProgressCard.vue'
import ReminderBanner from '../../components/training/ReminderBanner.vue'
import { useStudentAppState } from '../../composables/useStudentAppState'

const route = useRoute()
const { state, refreshReminderEligibility, setReminderSource } = useStudentAppState()

const showReminderBanner = computed(() => state.reminderSource === 'wechat-reminder' && state.dailyAdherence.validCheckIns < 3)

watchEffect(() => {
  if (route.query.source === 'reminder') {
    setReminderSource('wechat-reminder')
  }

  refreshReminderEligibility()
})
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-420 flex-col gap-18 px-20 py-24">
    <ReminderBanner :visible="showReminderBanner" />

    <section class="card-shell home-page__hero">
      <div class="home-page__hero-tag">Daily Hub</div>
      <p class="section-title">Choose your next exercise snack</p>
      <p class="home-page__hero-copy">
        Pick one playful session, finish it, and keep your streak moving.
      </p>
    </section>

    <DailyProgressCard
      :qualifying-days="state.weeklyAdherence.qualifyingDays"
      :reminder-eligible="state.dailyAdherence.reminderEligible"
      :valid-check-ins="state.dailyAdherence.validCheckIns"
    />

    <section class="card-shell p-20">
      <div class="home-page__hero-tag home-page__hero-tag--teal">Quick Actions</div>
      <p class="section-title mt-10">Choose your next exercise snack</p>
      <p class="mt-10 text-[28px] leading-[40px] text-slate-600">
        Mix Wushu, HIIT, and stair-climbing freely. Each finished guided flow counts.
      </p>

      <div class="home-page__actions">
        <RouterLink
          class="home-action home-action--primary flex-1"
          to="/training/select"
        >
          Start training
        </RouterLink>
        <RouterLink
          class="home-action home-action--secondary"
          to="/growth"
        >
          Open growth
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-page__hero {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.home-page__hero-tag {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 3px solid rgba(255, 211, 132, 0.26);
  background: rgba(255, 211, 132, 0.16);
  color: #d97706;
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.home-page__hero-tag--teal {
  border-color: rgba(137, 207, 255, 0.26);
  background: rgba(137, 207, 255, 0.14);
  color: #2b7cb8;
}

.home-page__hero-copy {
  margin: 0;
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 700;
}

.home-page__actions {
  margin-top: 1.125rem;
  display: flex;
  gap: 0.75rem;
}

.home-action {
  display: inline-flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 4rem;
  border-radius: 9999px;
  padding: 1rem 1.25rem;
  font-size: 28px;
  line-height: 1.3;
  text-align: center;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 6px 0 rgba(26, 32, 44, 0.08);
  transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
}

.home-action:hover {
  transform: translateY(-1px);
}

.home-action:focus-visible {
  outline: 3px solid rgba(34, 48, 74, 0.25);
  outline-offset: 2px;
}

.home-action--primary {
  background: #ff7f6a;
  color: white;
}

.home-action--secondary {
  background: rgb(241 245 249);
  color: rgb(71 85 105);
  border: 3px solid rgba(255, 211, 132, 0.3);
}
</style>
