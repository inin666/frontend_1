import type { TrainingModality } from '../../domain/student/types'

export function createCameraSessionAnalysis(input: {
  modality: Exclude<TrainingModality, 'stair'>
  qualityScore: number
}) {
  return {
    qualityScore: input.qualityScore,
    summary:
      input.modality === 'hiit'
        ? '力量很足，下一轮把落地再放轻一些。'
        : '控制得很好，继续放松肩膀。',
    capturedBy: 'camera' as const
  }
}
