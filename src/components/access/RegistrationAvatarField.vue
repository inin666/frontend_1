<script setup lang="ts">
import type { AvatarUploadState } from '../../uni-app/composables/useRegistrationAvatar'

const props = defineProps<{
  avatarUrl: string
  uploadState: AvatarUploadState
  errorMessage: string
  isWechatMiniProgram: boolean
}>()

const emit = defineEmits<{
  chooseWechatAvatar: [event: { detail?: { avatarUrl?: string } }]
}>()
</script>

<template>
  <button
    class="avatar-field__trigger"
    :disabled="!props.isWechatMiniProgram"
    open-type="chooseAvatar"
    @chooseavatar="emit('chooseWechatAvatar', $event)"
  >
    <view class="avatar-field">
      <view class="avatar-field__preview-shell">
        <image
          v-if="props.avatarUrl"
          class="avatar-field__preview-image"
          :src="props.avatarUrl"
          mode="aspectFill"
        />
        <text v-else-if="props.uploadState === 'uploading'" class="avatar-field__preview-placeholder">
          上传中
        </text>
        <text v-else class="avatar-field__preview-placeholder">添加照片</text>
      </view>
    </view>
  </button>
</template>

<style scoped>
.avatar-field {
  display: flex;
  width: 100%;
  justify-content: center;
}

.avatar-field__trigger {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0;
  padding: 0;
  background: transparent;
  text-align: left;
}

.avatar-field__trigger::after {
  border: none;
}

.avatar-field__preview-shell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 132rpx;
  height: 132rpx;
  overflow: hidden;
  flex: none;
  border-radius: 9999px;
  background: #ffffff;
  border: 4rpx solid rgba(255, 255, 255, 0.92);
  box-shadow: 0 10rpx 0 rgba(0, 0, 0, 0.05);
}

.avatar-field__preview-image {
  width: 100%;
  height: 100%;
}

.avatar-field__preview-placeholder {
  padding: 0 18rpx;
  color: #B45309;
  font-size: 24rpx;
  line-height: 1.35;
  font-weight: 900;
  text-align: center;
}
</style>
