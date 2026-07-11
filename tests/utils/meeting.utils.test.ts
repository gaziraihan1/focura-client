import { describe, it, expect } from 'vitest'
import {
  formatMeetingDate,
  formatMeetingTime,
  formatMeetingDuration,
  isMeetingLive,
  toLocalInputDatetime,
  fromLocalInputDatetime,
  STATUS_LABELS,
  STATUS_COLORS,
  VISIBILITY_LABELS,
} from '@/utils/meeting.utils'

describe('formatMeetingDate', () => {
  it('formats date correctly', () => {
    const result = formatMeetingDate('2024-01-15T10:00:00Z')
    expect(result).toContain('Mon')
    expect(result).toContain('Jan')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })
})

describe('formatMeetingTime', () => {
  it('formats time correctly', () => {
    const result = formatMeetingTime('2024-01-15T14:30:00Z')
    expect(result).toMatch(/\d{1,2}:\d{2}/)
  })
})

describe('formatMeetingDuration', () => {
  it('returns minutes only when < 1 hour', () => {
    const start = '2024-01-15T10:00:00Z'
    const end = '2024-01-15T10:30:00Z'
    expect(formatMeetingDuration(start, end)).toBe('30m')
  })

  it('returns hours only when exact hours', () => {
    const start = '2024-01-15T10:00:00Z'
    const end = '2024-01-15T11:00:00Z'
    expect(formatMeetingDuration(start, end)).toBe('1h')
  })

  it('returns hours and minutes', () => {
    const start = '2024-01-15T10:00:00Z'
    const end = '2024-01-15T11:30:00Z'
    expect(formatMeetingDuration(start, end)).toBe('1h 30m')
  })
})

describe('isMeetingLive', () => {
  it('returns true for ongoing meeting', () => {
    const now = new Date()
    const start = new Date(now.getTime() - 3600000).toISOString()
    const end = new Date(now.getTime() + 3600000).toISOString()
    expect(isMeetingLive(start, end)).toBe(true)
  })

  it('returns false for past meeting', () => {
    const start = '2020-01-01T10:00:00Z'
    const end = '2020-01-01T11:00:00Z'
    expect(isMeetingLive(start, end)).toBe(false)
  })

  it('returns false for future meeting', () => {
    const start = '2099-01-01T10:00:00Z'
    const end = '2099-01-01T11:00:00Z'
    expect(isMeetingLive(start, end)).toBe(false)
  })
})

describe('toLocalInputDatetime', () => {
  it('formats to local datetime string', () => {
    const result = toLocalInputDatetime('2024-01-15T14:30:00Z')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  })
})

describe('fromLocalInputDatetime', () => {
  it('converts local datetime to ISO string', () => {
    const result = fromLocalInputDatetime('2024-01-15T14:30')
    expect(result).toContain('2024')
  })
})

describe('STATUS_LABELS', () => {
  it('has all status labels', () => {
    expect(STATUS_LABELS.SCHEDULED).toBe('Scheduled')
    expect(STATUS_LABELS.ONGOING).toBe('Ongoing')
    expect(STATUS_LABELS.COMPLETED).toBe('Completed')
    expect(STATUS_LABELS.CANCELLED).toBe('Cancelled')
  })
})

describe('STATUS_COLORS', () => {
  it('has all status colors', () => {
    expect(STATUS_COLORS.SCHEDULED).toContain('blue')
    expect(STATUS_COLORS.ONGOING).toContain('green')
    expect(STATUS_COLORS.COMPLETED).toContain('muted')
    expect(STATUS_COLORS.CANCELLED).toContain('destructive')
  })
})

describe('VISIBILITY_LABELS', () => {
  it('has all visibility labels', () => {
    expect(VISIBILITY_LABELS.PUBLIC).toBe('Public')
    expect(VISIBILITY_LABELS.PRIVATE).toBe('Private')
  })
})
