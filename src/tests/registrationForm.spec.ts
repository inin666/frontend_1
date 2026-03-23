import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RegistrationForm from '../components/access/RegistrationForm.vue'

const avatarController = {
  avatarUrl: '',
  avatarSource: '' as '' | 'wechat' | 'album' | 'camera',
  uploadState: 'idle' as 'idle' | 'uploading' | 'success' | 'error',
  errorMessage: '',
  isWechatMiniProgram: true,
  handleWechatAvatarChoice: vi.fn(),
  openImageSourceActionSheet: vi.fn()
}

vi.mock('../uni-app/composables/useRegistrationAvatar', () => ({
  useRegistrationAvatar: () => avatarController
}))

function mountForm() {
  return mount(RegistrationForm, {
    global: {
      stubs: {
        picker: {
          name: 'PickerStub',
          template: '<div class="picker-stub"><slot /></div>'
        }
      }
    }
  })
}

async function fillValidProfileFields(wrapper: ReturnType<typeof mountForm>) {
  await wrapper.get('input[name="studentId"]').setValue('S-001')
  await wrapper.get('input[name="name"]').setValue('Lin')
  await wrapper.get('input[name="major"]').setValue('Sports Science')

  const pickers = wrapper.findAll('.picker-stub')
  await pickers[0]?.trigger('change', { detail: { value: 0 } })
  await pickers[1]?.trigger('change', { detail: { value: 0 } })
}

describe('registration form', () => {
  beforeEach(() => {
    avatarController.avatarUrl = ''
    avatarController.avatarSource = ''
    avatarController.uploadState = 'idle'
    avatarController.errorMessage = ''
    avatarController.handleWechatAvatarChoice.mockReset()
    avatarController.openImageSourceActionSheet.mockReset()
  })

  it('does not emit submit until avatar upload succeeds', async () => {
    const wrapper = mountForm()
    await fillValidProfileFields(wrapper)

    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('emits avatar metadata once upload succeeds', async () => {
    avatarController.avatarUrl = 'https://cdn.example.com/avatar.png'
    avatarController.avatarSource = 'wechat'
    avatarController.uploadState = 'success'

    const wrapper = mountForm()
    await fillValidProfileFields(wrapper)

    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')).toEqual([
      [
        expect.objectContaining({
          studentId: 'S-001',
          name: 'Lin',
          major: 'Sports Science',
          gender: 'Female',
          grade: 'Year 1',
          avatarUrl: 'https://cdn.example.com/avatar.png',
          avatarSource: 'wechat'
        })
      ]
    ])
  })
})
