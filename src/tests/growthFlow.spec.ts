import { createInitialStudentState } from '../domain/student/state'

describe('student growth summaries', () => {
  async function loadGrowthModule() {
    return import('../domain/student/growth')
  }

  it('builds student-facing summary cards from training history', async () => {
    const { buildGrowthSummary } = await loadGrowthModule()
    const state = createInitialStudentState()
    state.sessions = [
      {
        id: 'session-1',
        modality: 'wushu',
        date: '2026-03-18',
        completed: true,
        validCheckInApplied: true,
        restartedAfterInterrupt: false,
        shortQuestionnaire: null,
        analysis: {
          qualityScore: 86,
          summary: 'Smooth cadence',
          capturedBy: 'camera'
        }
      }
    ]
    state.longQuestionnaires.baseline.completed = true
    state.longQuestionnaires.baseline.score = 72
    state.longQuestionnaires.baseline.percentage = 86

    const summary = buildGrowthSummary(state)

    expect(summary.completedSessions).toBe(1)
    expect(summary.latestAssessment?.checkpoint).toBe('baseline')
    expect(summary.summaryCards).toEqual([
      {
        key: 'completed-sessions',
        label: '完成训练',
        value: '1',
        description: '已完整完成的训练次数。'
      },
      {
        key: 'valid-checkins',
        label: '有效打卡',
        value: '1',
        description: '计入坚持目标的训练次数。'
      },
      {
        key: 'current-streak',
        label: '当前连续天数',
        value: '1 天',
        description: '连续完成训练的天数。'
      },
      {
        key: 'weekly-goal',
        label: '每周目标',
        value: '进行中',
        description: '本周已达标 0 天。'
      }
    ])
    expect(summary.achievements.map(item => item.title)).toEqual([
      '起步有力',
      '势头建立者',
      '评估探索者'
    ])
  })

  it('returns an empty-state model when physical metrics are unavailable', async () => {
    const { resolvePhysicalMetricsState } = await loadGrowthModule()

    expect(resolvePhysicalMetricsState(createInitialStudentState())).toEqual({
      hasMetrics: false,
      message: '导入体测数据后将在此显示体能指标。'
    })
  })
})
