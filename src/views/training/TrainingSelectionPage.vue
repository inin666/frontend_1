<script setup lang="ts">
import { useRouter } from 'vue-router'
import TrainingModeCard from '../../components/training/TrainingModeCard.vue'
import type { TrainingModality } from '../../types/student'

const router = useRouter()

function chooseMode(modality: TrainingModality) {
  if (modality === 'stair') {
    void router.push('/training/stairs')
    return
  }

  void router.push(`/training/visual/${modality}`)
}
</script>

<template>
  <main class="select-page">
    <section class="card-shell select-page__hero-card">
      <div class="select-page__hero-tag">Session Arcade</div>
      <div class="select-page__hero-sticker">🎮</div>
      <p class="section-title">Pick your session</p>
      <p class="select-page__hero-copy text-17 leading-7 text-slate-600">
        Choose one playful training mode. Each card should feel like a mini game, not a bland form step.
      </p>
    </section>

    <TrainingModeCard
      accent-class="bg-brand-coral/16 text-brand-coral"
      description="Camera-guided martial movement with split-screen feedback."
      modality="wushu"
      title="Wushu"
      @choose="chooseMode"
    />
    <TrainingModeCard
      accent-class="bg-brand-gold/22 text-brand-ink"
      description="Fast, rhythmic intervals with live camera placeholders."
      modality="hiit"
      title="HIIT"
      @choose="chooseMode"
    />
    <TrainingModeCard
      accent-class="bg-brand-teal/16 text-brand-ink"
      description="A 30-second motion-sensor burst for stair-climbing practice."
      modality="stair"
      title="Stair-climbing"
      @choose="chooseMode"
    />
  </main>
</template>

<style scoped>
.select-page {
  margin: 0 auto;
  display: flex;
  min-height: 100vh;
  max-width: 420px;
  flex-direction: column;
  gap: 1.125rem;
  padding: 1.5rem 1.25rem;
}

.select-page__hero-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow: hidden;
}

.select-page__hero-tag {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 3px solid rgba(137, 207, 255, 0.26);
  background: rgba(137, 207, 255, 0.14);
  color: #2B7CB8;
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.select-page__hero-sticker {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-flex;
  width: 3.6rem;
  height: 3.6rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 4px solid #ffffff;
  background: rgba(255, 211, 132, 0.9);
  box-shadow: 0 10px 0 rgba(255, 211, 132, 0.28);
  font-size: 1.7rem;
}

.select-page__hero-copy {
  margin: 0;
  max-width: 18rem;
  color: #64748B;
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 700;
}
</style>
