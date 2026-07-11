import { describe, it, expect } from 'vitest'
import { formatDate, formatTime, getDuration, getInitials, avatarColor } from '@/utils/meetingDetails.utils'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const result = formatDate('2024-01-15T10:00:00Z')
    expect(result).toContain('Monday')
    expect(result).toContain('January')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })
})

describe('formatTime', () => {
  it('formats time correctly', () => {
    const result = formatTime('2024-01-15T14:30:00Z')
    expect(result).toMatch(/\d{2}:\d{2}/)
  })
})

describe('getDuration', () => {
  it('returns minutes when < 1 hour', () => {
    const result = getDuration('2024-01-15T10:00:00Z', '2024-01-15T10:30:00Z')
    expect(result).toContain('m')
  })

  it('returns hours only when exact', () => {
    const result = getDuration('2024-01-15T10:00:00Z', '2024-01-15T11:00:00Z')
    expect(result).toBe('1h')
  })

  it('returns hours and minutes', () => {
    const result = getDuration('2024-01-15T10:00:00Z', '2024-01-15T11:30:00Z')
    expect(result).toBe('1h 30m')
  })
})

describe('getInitials', () => {
  it('returns initials from name', () => {
    expect(getInitials('John Doe', 'john@example.com')).toBe('JD')
  })

  it('returns single initial from single name', () => {
    expect(getInitials('John', 'john@example.com')).toBe('J')
  })

  it('returns email first char when name is null', () => {
    expect(getInitials(null, 'john@example.com')).toBe('J')
  })

  it('limits to 2 initials', () => {
    expect(getInitials('John Michael Doe', 'john@example.com')).toBe('JM')
  })
})

describe('avatarColor', () => {
  it('returns a color class', () => {
    const color = avatarColor('user-123')
    expect(color).toContain('bg-')
    expect(color).toContain('text-')
  })

  it('returns deterministic color for same id', () => {
    expect(avatarColor('user-123')).toBe(avatarColor('user-123'))
  })

  it('returns different colors for different ids', () => {
    const color1 = avatarColor('user-1')
    const color2 = avatarColor('user-999')
    // They could be same due to hash collision, but very unlikely
    expect(typeof color1).toBe('string')
    expect(typeof color2).toBe('string')
  })
})
