export function createSensorSessionAnalysis(input: {
  durationSeconds: number
  completedIntervals: number
}) {
  const qualityScore = Math.max(60, Math.min(95, 60 + input.completedIntervals * 9 + Math.floor(input.durationSeconds / 10)))

  return {
    qualityScore,
    summary: '传感器采集很稳定，下一轮可以尝试把抬膝再提高一些。',
    capturedBy: 'sensor' as const
  }
}
