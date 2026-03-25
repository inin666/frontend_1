<script setup lang="ts">
import { computed, reactive, unref } from 'vue'
import type { StudentProfile } from '../../domain/student/types'
import RegistrationAvatarField from './RegistrationAvatarField.vue'
import { useRegistrationAvatar } from '../../uni-app/composables/useRegistrationAvatar'

type RegistrationPayload = Omit<StudentProfile, 'completed'>

const emit = defineEmits<{
  submit: [payload: RegistrationPayload]
}>()

const avatar = useRegistrationAvatar()
const form = reactive<RegistrationPayload>({
  avatarUrl: '',
  avatarSource: '',
  studentId: '',
  name: '',
  gender: '',
  age: 12,
  major: '',
  grade: '',
  heightCm: 150,
  weightKg: 40,
  restingHeartRate: 70
})

const genderOptions = ['Female', 'Male', 'Other']
const gradeOptions = ['Year 1', 'Year 2', 'Year 3', 'Year 4']

const currentAvatarUrl = computed(() => unref(avatar.avatarUrl) ?? '')
const currentAvatarSource = computed(() => unref(avatar.avatarSource) ?? '')
const currentAvatarUploadState = computed(() => unref(avatar.uploadState) ?? 'idle')
const currentAvatarErrorMessage = computed(() => unref(avatar.errorMessage) ?? '')
const showWechatAvatarButton = computed(() => Boolean(unref(avatar.isWechatMiniProgram)))

const selectedGenderIndex = computed(() => {
  const index = genderOptions.indexOf(form.gender)

  return index >= 0 ? index : 0
})

const selectedGradeIndex = computed(() => {
  const index = gradeOptions.indexOf(form.grade)

  return index >= 0 ? index : 0
})

const canSubmit = computed(() => {
  return (
    form.studentId.trim().length > 0 &&
    form.name.trim().length > 0 &&
    form.gender.trim().length > 0 &&
    form.major.trim().length > 0 &&
    form.grade.trim().length > 0 &&
    currentAvatarUrl.value.trim().length > 0 &&
    currentAvatarUploadState.value === 'success' &&
    form.age > 0 &&
    form.heightCm > 0 &&
    form.weightKg > 0 &&
    form.restingHeartRate > 0
  )
})

function handleSubmit() {
  if (!canSubmit.value) {
    return
  }

  emit('submit', {
    ...form,
    avatarUrl: currentAvatarUrl.value,
    avatarSource: currentAvatarSource.value
  })
}

function handleGenderChange(event: { detail?: { value?: string | number } }) {
  const nextIndex = Number(event.detail?.value ?? 0)

  form.gender = genderOptions[nextIndex] ?? ''
}

function handleGradeChange(event: { detail?: { value?: string | number } }) {
  const nextIndex = Number(event.detail?.value ?? 0)

  form.grade = gradeOptions[nextIndex] ?? ''
}
</script>

<template>
  <form class="flex flex-col gap-[32rpx]" @submit.prevent="handleSubmit">
    <view class="form-card form-card--gold">
      <view class="form-card__header">
        <view class="form-card__heading">
          <text class="form-card__kicker form-card__kicker--gold">Basic Info</text>
          <text class="form-card__title">Tell us who is joining today.</text>
        </view>
      </view>

      <RegistrationAvatarField
        :avatar-url="currentAvatarUrl"
        :upload-state="currentAvatarUploadState"
        :error-message="currentAvatarErrorMessage"
        :is-wechat-mini-program="showWechatAvatarButton"
        @choose-wechat-avatar="avatar.handleWechatAvatarChoice"
        @choose-image-source="avatar.selectImageSource"
      />
      
      <view class="form-stack-field">
        <text class="text-[28rpx] font-800 text-[#1A202C] ml-[12rpx]">Student ID</text>
        <input v-model.trim="form.studentId" autocomplete="username" class="input-shell registration-input-shell" name="studentId" placeholder="E.g. S-001" />
      </view>

      <view class="form-stack-field">
        <text class="text-[28rpx] font-800 text-[#1A202C] ml-[12rpx]">Full Name</text>
        <input v-model.trim="form.name" autocomplete="name" class="input-shell registration-input-shell" name="name" placeholder="E.g. Sporty Sam" />
      </view>

      <view class="form-row">
        <view class="form-row__field flex flex-col gap-[16rpx]">
          <text class="text-[28rpx] font-800 text-[#1A202C] ml-[12rpx]">Gender</text>
          <picker
            class="registration-picker-shell"
            mode="selector"
            :range="genderOptions"
            :value="selectedGenderIndex"
            @change="handleGenderChange"
          >
            <view class="input-shell registration-input-shell registration-input-shell--picker flex items-center">
              {{ form.gender || 'Select' }}
            </view>
          </picker>
        </view>
        
        <view class="form-row__field flex flex-col gap-[16rpx]">
          <text class="text-[28rpx] font-800 text-[#1A202C] ml-[12rpx]">Age</text>
          <input v-model.number="form.age" autocomplete="off" class="input-shell registration-input-shell" min="5" name="age" placeholder="12" type="number" />
        </view>
      </view>
      
      <view class="form-row">
        <view class="form-row__field flex flex-col gap-[16rpx]">
          <text class="text-[28rpx] font-800 text-[#1A202C] ml-[12rpx]">Major</text>
          <input v-model.trim="form.major" autocomplete="organization-title" class="input-shell registration-input-shell" name="major" placeholder="Sci..." />
        </view>
        
        <view class="form-row__field flex flex-col gap-[16rpx]">
          <text class="text-[28rpx] font-800 text-[#1A202C] ml-[12rpx]">Grade</text>
          <picker
            class="registration-picker-shell"
            mode="selector"
            :range="gradeOptions"
            :value="selectedGradeIndex"
            @change="handleGradeChange"
          >
            <view class="input-shell registration-input-shell registration-input-shell--picker flex items-center">
              {{ form.grade || 'Select' }}
            </view>
          </picker>
        </view>
      </view>
    </view>

    <view class="form-card form-card--teal">
      <view class="form-card__header">
        <view class="form-card__sticker form-card__sticker--teal">
          <text class="text-[40rpx]">💓</text>
        </view>
        <view class="form-card__heading">
          <text class="form-card__kicker form-card__kicker--teal">Health Metrics</text>
          <text class="form-card__title">Add a quick baseline before training starts.</text>
        </view>
      </view>

      <view class="form-row">
        <view class="form-row__field flex flex-col gap-[16rpx]">
          <text class="text-[28rpx] font-800 text-[#1A202C] ml-[12rpx]">Height (cm)</text>
          <input v-model.number="form.heightCm" autocomplete="off" class="input-shell registration-input-shell" min="1" name="heightCm" placeholder="160" type="number" />
        </view>

        <view class="form-row__field flex flex-col gap-[16rpx]">
          <text class="text-[28rpx] font-800 text-[#1A202C] ml-[12rpx]">Weight (kg)</text>
          <input v-model.number="form.weightKg" autocomplete="off" class="input-shell registration-input-shell" min="1" name="weightKg" placeholder="50" type="number" />
        </view>
      </view>

      <view class="form-stack-field">
        <text class="text-[28rpx] font-800 text-[#1A202C] ml-[12rpx]">Resting HR (bpm)</text>
        <input v-model.number="form.restingHeartRate" autocomplete="off" class="input-shell registration-input-shell" min="1" name="restingHeartRate" placeholder="70" type="number" />
      </view>
    </view>

    <view class="form-card__footer-note">
      <text>Everything here only sets up your starting profile. You can refine it later.</text>
    </view>

    <button form-type="submit" class="btn-primary mt-[24rpx] mb-[48rpx]" :disabled="!canSubmit">
      <text class="tracking-wide">Ready, Set, Go! 🚀</text>
    </button>
  </form>
</template>

<style scoped>
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}

.form-row__field {
  flex: 1 1 240rpx;
  min-width: 0;
}

.form-stack-field {
  display: flex;
  width: 100%;
  max-width: 480rpx;
  align-self: flex-start;
  flex-direction: column;
  gap: 16rpx;
}

.registration-input-shell {
  width: 100%;
  max-width: 100%;
  align-self: flex-start;
}

.registration-input-shell--picker {
  justify-content: space-between;
}

.registration-picker-shell {
  display: flex;
  width: 100%;
  max-width: 520rpx;
  align-self: flex-start;
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding: 40rpx;
  border-radius: 48rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 0 rgba(0, 0, 0, 0.05);
}

.form-card--gold {
  border: 8rpx solid rgba(255, 211, 132, 0.25);
}

.form-card--teal {
  border: 8rpx solid rgba(137, 207, 255, 0.25);
}

.form-card__header {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.form-card__heading {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 12rpx;
}

.form-card__sticker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 84rpx;
  height: 84rpx;
  flex: none;
  border-radius: 9999px;
  border: 4rpx solid #ffffff;
  box-shadow: 0 8rpx 0 rgba(0, 0, 0, 0.04);
}

.form-card__sticker--gold {
  background: rgba(255, 211, 132, 0.24);
}

.form-card__sticker--teal {
  background: rgba(137, 207, 255, 0.24);
}

.form-card__kicker {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  padding: 8rpx 18rpx;
  border-radius: 9999px;
  font-size: 24rpx;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.form-card__kicker--gold {
  color: #D97706;
  background: rgba(255, 211, 132, 0.14);
  border: 4rpx solid rgba(255, 211, 132, 0.22);
}

.form-card__kicker--teal {
  color: #2B7CB8;
  background: rgba(137, 207, 255, 0.14);
  border: 4rpx solid rgba(137, 207, 255, 0.22);
}

.form-card__title {
  display: block;
  color: #1A202C;
  font-size: 34rpx;
  line-height: 1.35;
  font-weight: 900;
}

.form-card__footer-note {
  display: flex;
  justify-content: center;
  padding: 0 16rpx;
  color: #64748B;
  font-size: 26rpx;
  line-height: 1.5;
  font-weight: 700;
  text-align: center;
}
</style>
