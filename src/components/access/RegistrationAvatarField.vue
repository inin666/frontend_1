<script setup lang="ts">
import { shallowRef } from 'vue'
import type { AvatarUploadState } from '../../uni-app/composables/useRegistrationAvatar'

const props = defineProps<{
  avatarUrl: string
  uploadState: AvatarUploadState
  errorMessage: string
  isWechatMiniProgram: boolean
}>()

const emit = defineEmits<{
  chooseWechatAvatar: [event: { detail?: { avatarUrl?: string } }]
  chooseImageSource: [source: 'album' | 'camera']
}>()

const isPickerOpen = shallowRef(false)

function togglePicker() {
  isPickerOpen.value = !isPickerOpen.value
}

function handleChooseWechatAvatar(event: { detail?: { avatarUrl?: string } }) {
  emit('chooseWechatAvatar', event)
  isPickerOpen.value = false
}

function handleChooseImageSource(source: 'album' | 'camera') {
  emit('chooseImageSource', source)
  isPickerOpen.value = false
}
</script>

<template>
  <view class="avatar-field">
    <view class="avatar-field__preview-shell">
      <image
        v-if="props.avatarUrl"
        class="avatar-field__preview-image"
        :src="props.avatarUrl"
        mode="aspectFill"
      />
      <text v-else class="avatar-field__preview-placeholder">添加照片</text>
    </view>

    <view class="avatar-field__content">
      <text class="avatar-field__label">个人头像</text>
      <text class="avatar-field__hint">
        可选择微信头像，或从相册/相机上传照片。
      </text>

      <view class="avatar-field__actions">
        <button
          v-if="props.isWechatMiniProgram"
          class="avatar-field__button avatar-field__button--wechat"
          open-type="chooseAvatar"
          @chooseavatar="emit('chooseWechatAvatar', $event)"
        >
          <text>使用微信头像</text>
        </button>

        <button
          class="avatar-field__button avatar-field__button--upload"
          @click="emit('chooseImage')"
        >
          <text>从相册或相机上传</text>
        </button>
      </view>

      <text v-if="props.uploadState === 'uploading'" class="avatar-field__status">
        正在上传头像...
      </text>
      <text v-else-if="props.uploadState === 'success'" class="avatar-field__status avatar-field__status--success">
        头像已准备好，可用于注册。
      </text>
      <text v-else-if="props.uploadState === 'error'" class="avatar-field__status avatar-field__status--error">
        {{ props.errorMessage }}
      </text>
    </view>
  </view>
</template>

<style scoped>
.avatar-field {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 24rpx;
  border-radius: 36rpx;
  background: rgba(255, 246, 214, 0.65);
  border: 4rpx solid rgba(255, 211, 132, 0.35);
}

.avatar-field__trigger {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 24rpx;
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

.avatar-field__content {
  display: flex;
  min-width: 0;
  flex: 1 1 0;
  flex-direction: column;
  gap: 14rpx;
}

.avatar-field__label {
  color: #1A202C;
  font-size: 28rpx;
  font-weight: 900;
}

.avatar-field__hint {
  color: #7C5A10;
  font-size: 24rpx;
  line-height: 1.5;
  font-weight: 700;
}

.avatar-field__status {
  color: #475569;
  font-size: 24rpx;
  line-height: 1.45;
  font-weight: 800;
}

.avatar-field__status--success {
  color: #166534;
}

.avatar-field__status--error {
  color: #B91C1C;
}

.avatar-field__picker-panel {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 14rpx;
  padding-top: 6rpx;
}

.avatar-field__picker-option {
  display: inline-flex;
  width: 100%;
  min-height: 84rpx;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 28rpx;
  border-radius: 9999px;
  font-size: 24rpx;
  line-height: 1.2;
  font-weight: 900;
}

.avatar-field__picker-option::after {
  border: none;
}

.avatar-field__picker-option--wechat {
  color: #166534;
  background: #DCFCE7;
}

.avatar-field__picker-option--upload {
  color: #9A3412;
  background: #FFEDD5;
}
</style>
