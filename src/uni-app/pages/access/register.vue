<script setup lang="ts">
import RegistrationForm from '../../../components/access/RegistrationForm.vue'
import type { StudentProfile } from '../../../domain/student/types'
import UniAccessPageShell from '../../components/access/UniAccessPageShell.vue'
import { useStudentStore } from '../../composables/useStudentStore'

type RegistrationPayload = Omit<StudentProfile, 'completed'>

const store = useStudentStore()

function handleSubmit(payload: RegistrationPayload) {
  store.completeProfile({
    ...payload,
    completed: true
  })
  store.setActiveCheckpoint('baseline')
  void uni.redirectTo({
    url: '/pages/access/questionnaire?checkpoint=baseline'
  })
}
</script>

<template>
  <UniAccessPageShell
    chip="A1"
    title="注册"
    subtitle="请先完善个人信息，注册完成后才能解锁训练。"
  >
    <RegistrationForm @submit="handleSubmit" />
  </UniAccessPageShell>
</template>
