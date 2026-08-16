// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  formatNumber,
  formatHours,
  formatPercentage,
  getStatusColor,
  getHealthColor,
  getWorkloadColor,
  getRiskColor,
  formatDate,
  formatShortDate,
  getRelativeTime,
  calculateTrendPercentage,
  getInitials,
  priorityDistribution,
  chartColors,
} from '@/utils/analytics.utils'

describe('formatNumber', () => {
  it('formats millions', () => {
    expect(formatNumber(1500000)).toBe('1.5M')
  })

  it('formats thousands', () => {
    expect(formatNumber(1500)).toBe('1.5K')
  })

  it('returns raw number for < 1000', () => {
    expect(formatNumber(500)).toBe('500')
  })
})

describe('formatHours', () => {
  it('returns 0h for 0', () => {
    expect(formatHours(0)).toBe('0h')
  })

  it('returns minutes for hours < 1', () => {
    expect(formatHours(0.5)).toBe('30m')
  })

  it('returns hours with decimal for >= 1', () => {
    expect(formatHours(5.5)).toBe('5.5h')
  })
})

describe('formatPercentage', () => {
  it('rounds and adds %', () => {
    expect(formatPercentage(75.6)).toBe('76%')
    expect(formatPercentage(50)).toBe('50%')
  })
})

describe('getStatusColor', () => {
  it('returns correct colors for task statuses', () => {
    expect(getStatusColor('TODO')).toContain('gray')
    expect(getStatusColor('IN_PROGRESS')).toContain('blue')
    expect(getStatusColor('IN_REVIEW')).toContain('purple')
    expect(getStatusColor('BLOCKED')).toContain('red')
    expect(getStatusColor('COMPLETED')).toContain('green')
    expect(getStatusColor('CANCELLED')).toContain('gray')
  })

  it('returns correct colors for project statuses', () => {
    expect(getStatusColor('PLANNING')).toContain('yellow')
    expect(getStatusColor('ACTIVE')).toContain('blue')
    expect(getStatusColor('ON_HOLD')).toContain('orange')
    expect(getStatusColor('ARCHIVED')).toContain('gray')
  })

  it('returns correct colors for priorities', () => {
    expect(getStatusColor('URGENT')).toContain('red')
    expect(getStatusColor('HIGH')).toContain('orange')
    expect(getStatusColor('MEDIUM')).toContain('yellow')
    expect(getStatusColor('LOW')).toContain('green')
  })

  it('returns default for unknown status', () => {
    expect(getStatusColor('UNKNOWN')).toContain('gray')
  })
})

describe('getHealthColor', () => {
  it('returns correct colors', () => {
    expect(getHealthColor('healthy')).toContain('green')
    expect(getHealthColor('at-risk')).toContain('yellow')
    expect(getHealthColor('critical')).toContain('red')
  })
})

describe('getWorkloadColor', () => {
  it('returns correct colors', () => {
    expect(getWorkloadColor('normal')).toContain('green')
    expect(getWorkloadColor('high')).toContain('yellow')
    expect(getWorkloadColor('overloaded')).toContain('red')
  })
})

describe('getRiskColor', () => {
  it('returns correct colors', () => {
    expect(getRiskColor('low')).toContain('green')
    expect(getRiskColor('medium')).toContain('yellow')
    expect(getRiskColor('high')).toContain('red')
  })
})

describe('formatDate', () => {
  it('formats Date object', () => {
    // Use a local-midnight date so the day is stable in any timezone.
    const result = formatDate(new Date(2024, 0, 15))
    expect(result).toContain('Jan')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('formats date string', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('Jan')
  })
})

describe('formatShortDate', () => {
  it('formats Date object without year', () => {
    const result = formatShortDate(new Date(2024, 0, 15))
    expect(result).toContain('Jan')
    expect(result).toContain('15')
    expect(result).not.toContain('2024')
  })
})

describe('getRelativeTime', () => {
  // The implementation compares millisecond timestamps, so targets are built
  // with pure ms offsets. Calendar math (setDate/setHours) breaks around DST
  // transitions, where a "day" is 23 or 25 hours long.
  const DAY = 24 * 60 * 60 * 1000

  it('returns Due today for today', () => {
    const laterToday = new Date(Date.now() + 30 * 60 * 1000)
    expect(getRelativeTime(laterToday)).toBe('Due today')
  })

  it('returns Due tomorrow for tomorrow', () => {
    // +1 day plus a margin so a few elapsed milliseconds can't round it down.
    const tomorrow = new Date(Date.now() + DAY + 60 * 60 * 1000)
    expect(getRelativeTime(tomorrow)).toBe('Due tomorrow')
  })

  it('returns overdue for past dates', () => {
    const past = new Date(Date.now() - 3 * DAY)
    expect(getRelativeTime(past)).toBe('3d overdue')
  })

  it('returns Due in Xd for near future', () => {
    const future = new Date(Date.now() + 5 * DAY + 60 * 60 * 1000)
    expect(getRelativeTime(future)).toBe('Due in 5d')
  })

  it('returns formatted date for far future', () => {
    const farFuture = new Date(Date.now() + 10 * DAY)
    expect(getRelativeTime(farFuture)).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/)
  })
})

describe('calculateTrendPercentage', () => {
  it('returns up when previous is 0 and current > 0', () => {
    expect(calculateTrendPercentage(10, 0)).toEqual({ value: 100, direction: 'up' })
  })

  it('returns stable when previous is 0 and current is 0', () => {
    expect(calculateTrendPercentage(0, 0)).toEqual({ value: 100, direction: 'stable' })
  })

  it('returns up for positive trend', () => {
    const result = calculateTrendPercentage(150, 100)
    expect(result.direction).toBe('up')
    expect(result.value).toBe(50)
  })

  it('returns down for negative trend', () => {
    const result = calculateTrendPercentage(50, 100)
    expect(result.direction).toBe('down')
    expect(result.value).toBe(50)
  })

  it('returns stable for no change', () => {
    const result = calculateTrendPercentage(100, 100)
    expect(result.direction).toBe('stable')
    expect(result.value).toBe(0)
  })
})

describe('getInitials', () => {
  it('returns two letter initials', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('returns single letter for single name', () => {
    expect(getInitials('John')).toBe('J')
  })

  it('returns ?? for null', () => {
    expect(getInitials(null)).toBe('??')
  })

  it('truncates to 2 chars max', () => {
    expect(getInitials('John Michael Doe')).toBe('JM')
  })
})

describe('priorityDistribution', () => {
  it('calculates total and maxCount', () => {
    const data = [
      { priority: 'URGENT' as const, count: 5 },
      { priority: 'HIGH' as const, count: 10 },
      { priority: 'MEDIUM' as const, count: 3 },
      { priority: 'LOW' as const, count: 7 },
    ]
    const result = priorityDistribution({ data })
    expect(result.total).toBe(25)
    expect(result.maxCount).toBe(10)
    expect(result.priorityConfig.URGENT.label).toBe('Urgent')
  })
})

describe('chartColors', () => {
  it('has all color keys', () => {
    expect(chartColors).toHaveProperty('primary')
    expect(chartColors).toHaveProperty('success')
    expect(chartColors).toHaveProperty('danger')
  })
})
