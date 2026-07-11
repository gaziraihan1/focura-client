import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  calculateYearlyDiscount,
  formatCents,
  formatDate,
  getInvoiceBadgeClass,
} from '@/utils/billing.upgrade.utils'

describe('formatPrice', () => {
  it('returns $0 for 0 cents', () => {
    expect(formatPrice(0, 'monthly')).toBe('$0')
  })

  it('formats monthly price', () => {
    expect(formatPrice(1900, 'monthly')).toBe('$19')
  })

  it('formats yearly price to per-month', () => {
    expect(formatPrice(1900, 'yearly')).toBe('$2')
  })
})

describe('calculateYearlyDiscount', () => {
  it('returns 0 for falsy inputs', () => {
    expect(calculateYearlyDiscount(0, 0)).toBe(0)
    expect(calculateYearlyDiscount(0, 100)).toBe(0)
    expect(calculateYearlyDiscount(100, 0)).toBe(0)
  })

  it('calculates correct discount', () => {
    // monthly: $10/mo = $120/yr, yearly: $100/yr => 17% discount
    const result = calculateYearlyDiscount(1000, 10000)
    expect(result).toBe(17)
  })
})

describe('formatCents', () => {
  it('formats cents to currency', () => {
    const result = formatCents(1999, 'usd')
    expect(result).toContain('$')
    expect(result).toContain('19.99')
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
    expect(result).toContain('Jan')
    expect(result).toContain('15')
  })
})

describe('getInvoiceBadgeClass', () => {
  it('returns correct classes for known statuses', () => {
    expect(getInvoiceBadgeClass('PAID')).toContain('green')
    expect(getInvoiceBadgeClass('OPEN')).toContain('amber')
    expect(getInvoiceBadgeClass('VOID')).toContain('muted')
    expect(getInvoiceBadgeClass('UNCOLLECTIBLE')).toContain('destructive')
    expect(getInvoiceBadgeClass('DRAFT')).toContain('muted')
  })

  it('returns default for unknown status', () => {
    expect(getInvoiceBadgeClass('UNKNOWN')).toContain('muted')
  })
})
