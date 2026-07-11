import { describe, it, expect } from 'vitest'
import { getStatusColor, getPriorityColor } from '@/utils/project.utils'

describe('getStatusColor', () => {
  it('returns correct colors for all statuses', () => {
    expect(getStatusColor('PLANNING')).toContain('purple')
    expect(getStatusColor('ACTIVE')).toContain('blue')
    expect(getStatusColor('ON_HOLD')).toContain('orange')
    expect(getStatusColor('COMPLETED')).toContain('green')
    expect(getStatusColor('ARCHIVED')).toContain('gray')
  })

  it('returns default for unknown status', () => {
    expect(getStatusColor('UNKNOWN')).toContain('gray')
  })
})

describe('getPriorityColor', () => {
  it('returns correct colors for all priorities', () => {
    expect(getPriorityColor('URGENT')).toContain('red')
    expect(getPriorityColor('HIGH')).toContain('orange')
    expect(getPriorityColor('MEDIUM')).toContain('blue')
    expect(getPriorityColor('LOW')).toContain('green')
  })

  it('returns default for unknown priority', () => {
    expect(getPriorityColor('UNKNOWN')).toContain('gray')
  })
})
