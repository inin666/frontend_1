import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import RegistrationForm from '../components/access/RegistrationForm.vue'

vi.mock('../composables/useStudentAppState', () => ({
  useStudentAppState: () => ({
    state: {
      reminderSource: null,
      dailyAdherence: {
        validCheckIns: 0,
        reminderEligible: true
      },
      weeklyAdherence: {
        qualifyingDays: 0
      }
    },
    refreshReminderEligibility: vi.fn(),
    setReminderSource: vi.fn()
  })
}))


describe('ui review fixes', () => {


  it('keeps stable metadata on registration inputs and uses picker selectors for miniapp fields', () => {
    const file = readFileSync(
      resolve('src/components/access/RegistrationForm.vue'),
      'utf8'
    )

    expect(file).toContain('input v-model.trim="form.studentId" autocomplete="username"')
    expect(file).toContain('input v-model.trim="form.name" autocomplete="name"')
    expect(file).toContain('input v-model.trim="form.major" autocomplete="organization-title"')
    expect(file).toContain('input v-model.number="form.heightCm" autocomplete="off"')
    expect(file).toContain('input v-model.number="form.weightKg" autocomplete="off"')
    expect(file).toContain('input v-model.number="form.restingHeartRate" autocomplete="off"')
    expect(file).toContain('mode="selector"')
    expect(file).toContain(':range="genderOptions"')
    expect(file).toContain(':range="gradeOptions"')
    expect(file).not.toContain('space-y-')
  })

  it('avoids peer-based selectors that compile to invalid wxss sibling syntax', () => {
    const shortQuestionnaireForm = readFileSync(
      resolve('src/components/training/ShortQuestionnaireForm.vue'),
      'utf8'
    )
    const longQuestionnaireForm = readFileSync(
      resolve('src/components/access/LongQuestionnaireForm.vue'),
      'utf8'
    )

    expect(shortQuestionnaireForm).not.toContain('peer-checked:')
    expect(shortQuestionnaireForm).not.toContain('sr-only peer')
    expect(longQuestionnaireForm).not.toContain('peer-checked:')
    expect(longQuestionnaireForm).not.toContain('sr-only peer')
  })

  it('avoids web font icon dependencies in miniapp-shared forms', () => {
    const registrationForm = readFileSync(
      resolve('src/components/access/RegistrationForm.vue'),
      'utf8'
    )
    const shortQuestionnaireForm = readFileSync(
      resolve('src/components/training/ShortQuestionnaireForm.vue'),
      'utf8'
    )

    expect(registrationForm).not.toContain('material-symbols-outlined')
    expect(registrationForm).not.toContain('font-variation-settings')
    expect(shortQuestionnaireForm).not.toContain('material-symbols-outlined')
    expect(shortQuestionnaireForm).not.toContain('font-variation-settings')
  })

  it('prefers text nodes over span tags in primary miniapp-shared components', () => {
    const files = [
      'src/components/access/AccessPageShell.vue',
      'src/components/access/RegistrationForm.vue',
      'src/components/training/TrainingModeCard.vue',
      'src/components/training/DailyProgressCard.vue',
      'src/components/training/StairTrainingPanel.vue',
      'src/components/training/VisualTrainingPanel.vue',
      'src/components/training/ShortQuestionnaireForm.vue'
    ]

    for (const filePath of files) {
      const file = readFileSync(resolve(filePath), 'utf8')

      expect(file).not.toContain('<span')
    }
  })

  it('uses miniapp form submission semantics on shared forms', () => {
    const files = [
      'src/components/access/RegistrationForm.vue',
      'src/components/access/LongQuestionnaireForm.vue',
      'src/components/training/ShortQuestionnaireForm.vue'
    ]

    for (const filePath of files) {
      const file = readFileSync(resolve(filePath), 'utf8')

      expect(file).toContain('form-type="submit"')
    }
  })


  it('uses uni-app navigation semantics for the primary access flow', () => {
    const registerPage = readFileSync(
      resolve('src/uni-app/pages/access/register.vue'),
      'utf8'
    )
    const questionnairePage = readFileSync(
      resolve('src/uni-app/pages/access/questionnaire.vue'),
      'utf8'
    )
    const resultPage = readFileSync(
      resolve('src/uni-app/pages/access/questionnaire-result.vue'),
      'utf8'
    )

    expect(registerPage).toContain('uni.redirectTo')
    expect(questionnairePage).toContain('uni.navigateTo')
    expect(resultPage).toContain('uni.redirectTo')
  })

  it('uses uni-app navigation semantics for the primary training flow', () => {
    const homePage = readFileSync(
      resolve('src/uni-app/pages/training/home.vue'),
      'utf8'
    )
    const selectionPage = readFileSync(
      resolve('src/uni-app/pages/training/select.vue'),
      'utf8'
    )
    const feedbackPage = readFileSync(
      resolve('src/uni-app/pages/training/feedback.vue'),
      'utf8'
    )

    expect(homePage).toContain('<navigator')
    expect(homePage).toContain('url="/pages/training/select"')
    expect(homePage).toContain('url="/pages/growth/index"')
    expect(selectionPage).toContain('uni.navigateTo')
    expect(feedbackPage).toContain('uni.redirectTo')
  })

  it('preserves clear interactive affordance on growth detail navigation after migration', () => {
    const growthIndexPage = readFileSync(
      resolve('src/uni-app/pages/growth/index.vue'),
      'utf8'
    )
    const metricsPage = readFileSync(
      resolve('src/uni-app/pages/growth/metrics.vue'),
      'utf8'
    )

    expect(growthIndexPage).toContain('uni.navigateTo')
    expect(growthIndexPage).toContain('.growth-page__link:active')
    expect(growthIndexPage).toContain('growth-page__link--current')
    expect(metricsPage).toContain('Physical metrics will appear here after body-test data is imported.')
  })



  it('removes web keyboard affordances from miniapp-first action surfaces', () => {
    const resultCard = readFileSync(
      resolve('src/components/access/QuestionnaireResultCard.vue'),
      'utf8'
    )
    const trainingModeCard = readFileSync(
      resolve('src/components/training/TrainingModeCard.vue'),
      'utf8'
    )
    const miniappHomePage = readFileSync(
      resolve('src/uni-app/pages/training/home.vue'),
      'utf8'
    )

    expect(resultCard).not.toContain('role="button"')
    expect(resultCard).not.toContain('tabindex="0"')
    expect(resultCard).not.toContain('@keydown.enter.prevent')
    expect(resultCard).not.toContain('@keydown.space.prevent')
    expect(resultCard).toContain('<button')
    expect(resultCard).toContain('type="button"')

    expect(trainingModeCard).not.toContain('role="button"')
    expect(trainingModeCard).not.toContain('tabindex="0"')
    expect(trainingModeCard).not.toContain('@keydown.enter.prevent')
    expect(trainingModeCard).not.toContain('@keydown.space.prevent')

    expect(miniappHomePage).toContain('<navigator')
    expect(miniappHomePage).toContain('url="/pages/training/select"')
    expect(miniappHomePage).toContain('url="/pages/growth/index"')
    expect(miniappHomePage).not.toContain('role="button"')
    expect(miniappHomePage).not.toContain('tabindex="0"')
    expect(miniappHomePage).not.toContain('@keydown.enter.prevent')
    expect(miniappHomePage).not.toContain('@keydown.space.prevent')
  })

  it('avoids grid and fixed decoration on miniapp-critical shared surfaces', () => {
    const progressCard = readFileSync(
      resolve('src/components/training/DailyProgressCard.vue'),
      'utf8'
    )
    const summaryCards = readFileSync(
      resolve('src/components/growth/GrowthSummaryCards.vue'),
      'utf8'
    )
    const adherenceHeatmap = readFileSync(
      resolve('src/components/growth/AdherenceHeatmap.vue'),
      'utf8'
    )
    const accessShell = readFileSync(
      resolve('src/components/access/AccessPageShell.vue'),
      'utf8'
    )
    const unoConfig = readFileSync(
      resolve('uno.config.ts'),
      'utf8'
    )

    expect(progressCard).not.toContain('grid grid-cols-3')
    expect(summaryCards).not.toContain('display: grid;')
    expect(summaryCards).not.toContain('grid-template-columns:')
    expect(adherenceHeatmap).not.toContain('display: grid;')
    expect(adherenceHeatmap).not.toContain('grid-auto-flow:')
    expect(adherenceHeatmap).not.toContain('grid-template-rows:')
    expect(accessShell).not.toContain('class="fixed')
    expect(accessShell).not.toContain(' fixed ')
    expect(unoConfig).not.toContain("'bouncy-btn': 'transition-all")
  })

  it('keeps registration and growth shared surfaces on flex-first miniapp layouts', () => {
    const registrationForm = readFileSync(
      resolve('src/components/access/RegistrationForm.vue'),
      'utf8'
    )
    const achievementBadgeList = readFileSync(
      resolve('src/components/growth/AchievementBadgeList.vue'),
      'utf8'
    )
    const physicalMetricsPanel = readFileSync(
      resolve('src/components/growth/PhysicalMetricsPanel.vue'),
      'utf8'
    )
    const trainingHistoryList = readFileSync(
      resolve('src/components/growth/TrainingHistoryList.vue'),
      'utf8'
    )
    const assessmentHistoryList = readFileSync(
      resolve('src/components/growth/AssessmentHistoryList.vue'),
      'utf8'
    )

    expect(registrationForm).not.toContain('grid grid-cols-2')
    expect(registrationForm).toContain('form-row')
    expect(achievementBadgeList).not.toContain('display: grid;')
    expect(achievementBadgeList).not.toContain('grid-template-columns:')
    expect(physicalMetricsPanel).not.toContain('display: grid;')
    expect(trainingHistoryList).not.toContain('display: grid;')
    expect(assessmentHistoryList).not.toContain('display: grid;')
  })

  it('keeps registration inputs visually narrower than the surrounding card shell', () => {
    const registrationForm = readFileSync(
      resolve('src/components/access/RegistrationForm.vue'),
      'utf8'
    )

    expect(registrationForm).toContain('registration-input-shell')
    expect(registrationForm).toContain('registration-picker-shell')
    expect(registrationForm).toContain('form-stack-field')
    expect(registrationForm).toContain('max-width: 480rpx;')
    expect(registrationForm).toContain('align-self: flex-start;')
    expect(registrationForm).not.toContain('class="w-full"')
  })

  it('keeps training panels and miniapp shells on low-risk layout and motion primitives', () => {
    const visualTrainingPanel = readFileSync(
      resolve('src/components/training/VisualTrainingPanel.vue'),
      'utf8'
    )
    const stairTrainingPanel = readFileSync(
      resolve('src/components/training/StairTrainingPanel.vue'),
      'utf8'
    )
    const sessionFeedbackCard = readFileSync(
      resolve('src/components/training/SessionFeedbackCard.vue'),
      'utf8'
    )
    const uniGrowthShell = readFileSync(
      resolve('src/uni-app/components/growth/UniGrowthPageShell.vue'),
      'utf8'
    )
    const accessShell = readFileSync(
      resolve('src/components/access/AccessPageShell.vue'),
      'utf8'
    )

    expect(visualTrainingPanel).not.toContain('grid grid-cols[')
    expect(visualTrainingPanel).not.toContain('grid grid-cols-')
    expect(visualTrainingPanel).not.toContain('transition-all')
    expect(stairTrainingPanel).not.toContain('transition-all')
    expect(sessionFeedbackCard).not.toContain('grid grid-cols-2')
    expect(uniGrowthShell).not.toContain('display: grid;')
    expect(accessShell).not.toContain('transition-all')
    expect(accessShell).not.toContain('animate-bounce')
    expect(accessShell).not.toContain('text-shadow:')
  })


  it('brings demo-style badge and sticker treatments into shared cards', () => {
    const registrationForm = readFileSync(
      resolve('src/components/access/RegistrationForm.vue'),
      'utf8'
    )
    const dailyProgressCard = readFileSync(
      resolve('src/components/training/DailyProgressCard.vue'),
      'utf8'
    )
    const reminderBanner = readFileSync(
      resolve('src/components/training/ReminderBanner.vue'),
      'utf8'
    )
    const summaryCards = readFileSync(
      resolve('src/components/growth/GrowthSummaryCards.vue'),
      'utf8'
    )

    expect(registrationForm).toContain('form-card__sticker')
    expect(registrationForm).toContain('form-card__kicker')
    expect(dailyProgressCard).toContain('progress-card__eyebrow')
    expect(dailyProgressCard).toContain('progress-card__meter-pill')
    expect(reminderBanner).toContain('reminder-banner__eyebrow')
    expect(summaryCards).toContain('summary-card__pill')
    expect(summaryCards).toContain('summary-card--highlight')
  })


  it('routes every rounded questionnaire option through the short check-in surface only', () => {
    const shortQuestionnaireForm = readFileSync(
      resolve('src/components/training/ShortQuestionnaireForm.vue'),
      'utf8'
    )
    const longQuestionnaireForm = readFileSync(
      resolve('src/components/access/LongQuestionnaireForm.vue'),
      'utf8'
    )

    expect(shortQuestionnaireForm).toContain('rating-option rating-option--rounded')
    expect(shortQuestionnaireForm).toContain('short-questionnaire-form__options')
    expect(shortQuestionnaireForm).toContain('short-questionnaire-form__option')
    expect(longQuestionnaireForm).not.toContain('rating-option--rounded')
  })

  it('gives long-questionnaire prompts and actions more breathing room', () => {
    const longQuestionnaireForm = readFileSync(
      resolve('src/components/access/LongQuestionnaireForm.vue'),
      'utf8'
    )

    expect(longQuestionnaireForm).toContain('long-questionnaire-form__card')
    expect(longQuestionnaireForm).toContain('long-questionnaire-form__prompt')
    expect(longQuestionnaireForm).toContain('long-questionnaire-form__options')
    expect(longQuestionnaireForm).toContain('long-questionnaire-form__actions')
    expect(longQuestionnaireForm).toContain('gap: 40rpx;')
    expect(longQuestionnaireForm).toContain('margin-bottom: 40rpx;')
    expect(longQuestionnaireForm).toContain('padding-bottom: 72rpx;')
  })


  it('wires the register avatar flow to WeChat avatar and image upload APIs', () => {
    const avatarField = readFileSync(
      resolve('src/components/access/RegistrationAvatarField.vue'),
      'utf8'
    )
    const avatarComposable = readFileSync(
      resolve('src/uni-app/composables/useRegistrationAvatar.ts'),
      'utf8'
    )

    expect(avatarField).toContain('open-type="chooseAvatar"')
    expect(avatarField).toContain('@chooseavatar=')
    expect(avatarComposable).toContain('detail?.avatarUrl')
    expect(avatarComposable).toContain('uni.chooseImage')
    expect(avatarComposable).toContain('sourceType: [source]')
    expect(avatarComposable).toContain('uni.uploadFile')
    expect(avatarComposable).toContain("name: 'file'")
  })
})