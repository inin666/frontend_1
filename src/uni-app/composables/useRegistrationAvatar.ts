import { shallowRef } from 'vue'
import type { StudentProfile } from '../../types/student'

export type AvatarSource = StudentProfile['avatarSource']
export type AvatarUploadState = 'idle' | 'uploading' | 'success' | 'error'

type ChooseAvatarEvent = {
  detail?: {
    avatarUrl?: string
  }
}

type UploadAvatarResult = {
  avatarUrl: string
}

const configuredUploadUrl = import.meta.env.VITE_AVATAR_UPLOAD_URL?.trim() ?? ''

function resolveUploadErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return 'Avatar upload failed. Please try again.'
}

function resolveUploadedAvatarUrl(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return ''
  }

  const directUrl = (payload as { avatarUrl?: unknown }).avatarUrl
  if (typeof directUrl === 'string' && directUrl.trim().length > 0) {
    return directUrl
  }

  const nestedData = (payload as { data?: unknown }).data
  if (!nestedData || typeof nestedData !== 'object') {
    return ''
  }

  const nestedUrl = (nestedData as { avatarUrl?: unknown }).avatarUrl
  return typeof nestedUrl === 'string' ? nestedUrl : ''
}

function parseUploadResponse(data: unknown) {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as unknown
    } catch {
      return { avatarUrl: data }
    }
  }

  return data
}

export function uploadAvatar(filePath: string): Promise<UploadAvatarResult> {
  if (!configuredUploadUrl) {
    return Promise.resolve({ avatarUrl: filePath })
  }

  return new Promise<UploadAvatarResult>((resolve, reject) => {
    if (typeof uni === 'undefined') {
      reject(new Error('Avatar upload is not available in this environment.'))
      return
    }

    uni.uploadFile({
      url: configuredUploadUrl,
      filePath,
      name: 'file',
      success(result) {
        const parsed = parseUploadResponse(result.data)
        const avatarUrl = resolveUploadedAvatarUrl(parsed)

        if (!avatarUrl) {
          reject(new Error('Avatar upload response did not include avatarUrl.'))
          return
        }

        resolve({ avatarUrl })
      },
      fail(error) {
        reject(error)
      }
    })
  })
}

export function useRegistrationAvatar() {
  const avatarUrl = shallowRef('')
  const avatarSource = shallowRef<AvatarSource>('')
  const uploadState = shallowRef<AvatarUploadState>('idle')
  const errorMessage = shallowRef('')
  const isWechatMiniProgram = shallowRef(
    typeof globalThis !== 'undefined' && 'wx' in globalThis
  )

  async function persistAvatar(filePath: string, source: Exclude<AvatarSource, ''>) {
    uploadState.value = 'uploading'
    errorMessage.value = ''

    try {
      const result = await uploadAvatar(filePath)

      avatarUrl.value = result.avatarUrl
      avatarSource.value = source
      uploadState.value = 'success'
    } catch (error) {
      avatarUrl.value = ''
      avatarSource.value = ''
      uploadState.value = 'error'
      errorMessage.value = resolveUploadErrorMessage(error)
    }
  }

  async function handleWechatAvatarChoice(event: ChooseAvatarEvent) {
    const filePath = event.detail?.avatarUrl?.trim()

    if (!filePath) {
      uploadState.value = 'error'
      errorMessage.value = 'WeChat avatar selection did not return an image.'
      return
    }

    await persistAvatar(filePath, 'wechat')
  }

  return {
    avatarUrl,
    avatarSource,
    uploadState,
    errorMessage,
    isWechatMiniProgram,
    handleWechatAvatarChoice
  }
}
