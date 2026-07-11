import { describe, it, expect } from 'vitest'
import {
  getWorkloadColor,
  getBurnoutColor,
  getWorkloadBarColor,
  normalizeDate,
  formatDateKey,
  isToday,
  isSameMonth,
} from '@/utils/calendar.utils'

describe('getWorkloadColor', () => {
  it('returns red when overCapacity', () => {
    expect(getWorkloadColor(0.5, true)).toContain('red')
  })

  it('returns amber for score > 1.2', () => {
    expect(getWorkloadColor(1.5, false)).toContain('amber')
  })

  it('returns yellow for score > 0.8', () => {
    expect(getWorkloadColor(1.0, false)).toContain('yellow')
  })

  it('returns blue for score > 0.3', () => {
    expect(getWorkloadColor(0.5, false)).toContain('blue')
  })

  it('returns background for low score', () => {
    expect(getWorkloadColor(0.2, false)).toBe('bg-background')
  })
})

describe('getBurnoutColor', () => {
  it('returns correct colors', () => {
    expect(getBurnoutColor('CRITICAL')).toContain('red')
    expect(getBurnoutColor('HIGH')).toContain('orange')
    expect(getBurnoutColor('MODERATE')).toContain('yellow')
    expect(getBurnoutColor('LOW')).toContain('green')
  })
})

describe('getWorkloadBarColor', () => {
  it('returns red when overCapacity', () => {
    expect(getWorkloadBarColor(true, 0.5)).toContain('red')
  })

  it('returns amber for high workload', () => {
    expect(getWorkloadBarColor(false, 0.9)).toContain('amber')
  })

  it('returns blue for normal workload', () => {
    expect(getWorkloadBarColor(false, 0.5)).toContain('blue')
  })
})

describe('normalizeDate', () => {
  it('sets hours to 0', () => {
    const date = new Date(2024, 0, 15, 14, 30)
    const normalized = normalizeDate(date)
    expect(normalized.getHours()).toBe(0)
    expect(normalized.getMinutes()).toBe(0)
    expect(normalized.getSeconds()).toBe(0)
    expect(normalized.getMilliseconds()).toBe(0)
  })
})

describe('formatDateKey', () => {
  it('returns YYYY-MM-DD format', () => {
    const date = new Date(Date.UTC(2024, 0, 15, 12, 0, 0))
    expect(formatDateKey(date)).toBe('2024-01-15')
  })
})

describe('isToday', () => {
  it('returns true for today', () => {
    expect(isToday(new Date())).toBe(true)
  })

  it('returns false for other date', () => {
    expect(isToday(new Date(2020, 0, 1))).toBe(false)
  })
})

describe('isSameMonth', () => {
  it('returns true for same month', () => {
    expect(isSameMonth(new Date(2024, 0, 1), new Date(2024, 0, 15))).toBe(true)
  })

  it('returns false for different month', () => {
    expect(isSameMonth(new Date(2024, 0, 1), new Date(2024, 1, 1))).toBe(false)
  })

  it('returns false for different year', () => {
    expect(isSameMonth(new Date(2024, 0, 1), new Date(2023, 0, 1))).toBe(false)
  })
})
