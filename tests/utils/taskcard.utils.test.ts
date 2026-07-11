import { describe, it, expect, vi } from 'vitest'
import {
  getPriorityColor,
  formatHoursSinceCreation,
  formatTime,
  getProgressPercentage,
  getProgressBarColor,
  calculateTimeProgress,
} from '@/utils/taskcard.utils'

describe('getPriorityColor', () => {
  it('returns correct colors for all priorities', () => {
    expect(getPriorityColor('URGENT')).toBe('text-red-500')
    expect(getPriorityColor('HIGH')).toBe('text-orange-500')
    expect(getPriorityColor('MEDIUM')).toBe('text-blue-500')
    expect(getPriorityColor('LOW')).toBe('text-green-500')
  })

  it('returns default for unknown priority', () => {
    expect(getPriorityColor('UNKNOWN' as any)).toBe('text-gray-500')
  })
})

describe('formatHoursSinceCreation', () => {
  it('formats hours for less than 24h', () => {
    expect(formatHoursSinceCreation(5)).toBe('5h')
  })

  it('formats days and hours for >= 24h', () => {
    expect(formatHoursSinceCreation(25)).toBe('1d 1h')
  })

  it('formats exact 24h', () => {
    expect(formatHoursSinceCreation(24)).toBe('1d 0h')
  })
})

describe('formatTime', () => {
  it('formats seconds to mm:ss', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(65)).toBe('1:05')
    expect(formatTime(120)).toBe('2:00')
  })

  it('pads single digit seconds', () => {
    expect(formatTime(9)).toBe('0:09')
  })
})

describe('getProgressPercentage', () => {
  it('returns 100 when timeRemaining is 0', () => {
    expect(getProgressPercentage(0)).toBe(100)
  })

  it('returns 100 when timeRemaining is negative', () => {
    expect(getProgressPercentage(-100)).toBe(100)
  })

  it('calculates percentage for positive timeRemaining', () => {
    expect(getProgressPercentage(750)).toBe(50)
  })
})

describe('getProgressBarColor', () => {
  it('returns red for > 100', () => {
    expect(getProgressBarColor(110)).toBe('bg-red-500')
  })

  it('returns orange for > 80', () => {
    expect(getProgressBarColor(90)).toBe('bg-orange-500')
  })

  it('returns purple for <= 80', () => {
    expect(getProgressBarColor(50)).toBe('bg-purple-500')
  })
})

describe('calculateTimeProgress', () => {
  it('returns null if startDate is missing', () => {
    expect(calculateTimeProgress(undefined, '2024-01-10', 5)).toBeNull()
  })

  it('returns null if dueDate is null', () => {
    expect(calculateTimeProgress('2024-01-01', null, 5)).toBeNull()
  })

  it('returns null if estimatedHours is undefined', () => {
    expect(calculateTimeProgress('2024-01-01', '2024-01-10', undefined)).toBeNull()
  })

  it('returns null if totalTime <= 0', () => {
    expect(calculateTimeProgress('2024-01-10', '2024-01-01', 5)).toBeNull()
  })

  it('calculates progress for valid dates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-05T12:00:00Z'))
    const result = calculateTimeProgress('2024-01-01', '2024-01-11', 8)
    expect(result).toBe(45)
    vi.useRealTimers()
  })
})
