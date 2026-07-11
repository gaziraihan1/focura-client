import { describe, it, expect, vi } from 'vitest'
import {
  formatTimeDuration,
  getTimeStatusColor,
  getFocusLevelColor,
  getEnergyTypeColor,
  getStatusColor,
  getPriorityColor,
  formatFileSize,
  formatHoursSinceCreation,
} from '@/utils/task.utils'

describe('formatTimeDuration', () => {
  it('formats minutes for hours < 1', () => {
    expect(formatTimeDuration(0.5)).toBe('30m')
  })

  it('formats hours for 1 <= hours < 24', () => {
    expect(formatTimeDuration(5)).toBe('5h')
  })

  it('formats days and hours for hours >= 24', () => {
    expect(formatTimeDuration(25)).toBe('1d 1h')
  })

  it('formats exact 24 hours', () => {
    expect(formatTimeDuration(24)).toBe('1d 0h')
  })

  it('formats overdue hours (negative, < 24)', () => {
    expect(formatTimeDuration(-3)).toBe('3h overdue')
  })

  it('formats overdue days (negative, >= 24)', () => {
    expect(formatTimeDuration(-25)).toBe('1d 1h overdue')
  })
})

describe('getTimeStatusColor', () => {
  it('returns gray for undefined', () => {
    expect(getTimeStatusColor(undefined)).toBe('text-gray-500')
  })

  it('returns red for overdue', () => {
    expect(getTimeStatusColor({ isOverdue: true, isDueToday: false, hoursUntilDue: -1, hoursSinceCreation: 0, timeProgress: null })).toBe('text-red-500')
  })

  it('returns orange for due today', () => {
    expect(getTimeStatusColor({ isOverdue: false, isDueToday: true, hoursUntilDue: 2, hoursSinceCreation: 0, timeProgress: null })).toBe('text-orange-500')
  })

  it('returns orange for hoursUntilDue < 24', () => {
    expect(getTimeStatusColor({ isOverdue: false, isDueToday: false, hoursUntilDue: 10, hoursSinceCreation: 0, timeProgress: null })).toBe('text-orange-500 ')
  })

  it('returns blue for hoursUntilDue >= 24', () => {
    expect(getTimeStatusColor({ isOverdue: false, isDueToday: false, hoursUntilDue: 48, hoursSinceCreation: 0, timeProgress: null })).toBe('text-blue-500')
  })

  it('returns blue for null hoursUntilDue', () => {
    expect(getTimeStatusColor({ isOverdue: false, isDueToday: false, hoursUntilDue: null, hoursSinceCreation: 0, timeProgress: null })).toBe('text-blue-500')
  })
})

describe('getFocusLevelColor', () => {
  it('returns red for level >= 4', () => {
    expect(getFocusLevelColor(4)).toBe('text-red-500')
    expect(getFocusLevelColor(5)).toBe('text-red-500')
  })

  it('returns orange for level 3', () => {
    expect(getFocusLevelColor(3)).toBe('text-orange-500')
  })

  it('returns blue for level < 3', () => {
    expect(getFocusLevelColor(2)).toBe('text-blue-500')
    expect(getFocusLevelColor(0)).toBe('text-blue-500')
  })
})

describe('getEnergyTypeColor', () => {
  it('returns correct color for LOW', () => {
    expect(getEnergyTypeColor('LOW')).toContain('text-green-500')
  })

  it('returns correct color for MEDIUM', () => {
    expect(getEnergyTypeColor('MEDIUM')).toContain('text-blue-500')
  })

  it('returns correct color for HIGH', () => {
    expect(getEnergyTypeColor('HIGH')).toContain('text-red-500')
  })

  it('returns default for unknown type', () => {
    expect(getEnergyTypeColor('UNKNOWN')).toBe('text-gray-500 bg-gray-500/10')
  })
})

describe('getStatusColor', () => {
  it('returns correct colors for all statuses', () => {
    expect(getStatusColor('TODO')).toContain('gray')
    expect(getStatusColor('IN_PROGRESS')).toContain('blue')
    expect(getStatusColor('IN_REVIEW')).toContain('purple')
    expect(getStatusColor('BLOCKED')).toContain('red')
    expect(getStatusColor('COMPLETED')).toContain('green')
    expect(getStatusColor('CANCELLED')).toContain('gray')
  })

  it('returns default for unknown status', () => {
    expect(getStatusColor('UNKNOWN' as any)).toBe('bg-gray-500/10 text-gray-500')
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
    expect(getPriorityColor('UNKNOWN' as any)).toBe('bg-gray-500/10 text-gray-500')
  })
})

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B')
  })

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })

  it('formats megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB')
  })
})

describe('formatHoursSinceCreation', () => {
  it('returns hours for less than 24h', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-02T12:00:00Z'))
    expect(formatHoursSinceCreation('2024-01-02T10:00:00Z')).toBe('2h')
    vi.useRealTimers()
  })

  it('returns days and hours for more than 24h', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-04T12:00:00Z'))
    expect(formatHoursSinceCreation('2024-01-02T10:00:00Z')).toBe('2d 2h')
    vi.useRealTimers()
  })
})
