import { describe, it, expect } from 'vitest'
import { daysUntil, formatDate, getGainKey } from '@/utils/billing.success.utils'

describe('daysUntil', () => {
  it('returns null for null input', () => {
    expect(daysUntil(null)).toBeNull()
  })

  it('returns null for undefined input', () => {
    expect(daysUntil(undefined)).toBeNull()
  })

  it('returns 0 for past date', () => {
    expect(daysUntil('2020-01-01')).toBe(0)
  })

  it('returns positive number for future date', () => {
    const future = new Date()
    future.setDate(future.getDate() + 5)
    expect(daysUntil(future.toISOString())).toBeGreaterThanOrEqual(4)
  })
})

describe('formatDate', () => {
  it('returns — for null', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('returns — for undefined', () => {
    expect(formatDate(undefined)).toBe('—')
  })

  it('formats valid date', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('January')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })
})

describe('getGainKey', () => {
  it('returns formatted key', () => {
    expect(getGainKey('FREE', 'PRO')).toBe('FREE→PRO')
  })
})
