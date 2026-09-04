// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  formatWorkspaceLimitValue,
  isGabluraAdminChange,
  getWorkspaceLimitParts,
} from '@/utils/workspace-limits'

describe('isGabluraAdminChange', () => {
  it('detects the gablura-admin marker only', () => {
    expect(isGabluraAdminChange('gablura-admin')).toBe(true)
    expect(isGabluraAdminChange(undefined)).toBe(false)
    expect(isGabluraAdminChange('user')).toBe(false)
  })
})

describe('formatWorkspaceLimitValue', () => {
  it('formats plain numbers with locale separators', () => {
    expect(formatWorkspaceLimitValue('aiDailyCalls', 9000)).toBe('9,000')
    expect(formatWorkspaceLimitValue('aiMaxOutputTokens', 8192)).toBe('8,192')
    expect(formatWorkspaceLimitValue('maxMembers', 100)).toBe('100')
  })

  it('compacts monthly token values over 1M', () => {
    expect(formatWorkspaceLimitValue('aiMonthlyTokens', 100000000)).toBe('100M')
    expect(formatWorkspaceLimitValue('aiMonthlyTokens', 1500000)).toBe('1.5M')
    expect(formatWorkspaceLimitValue('aiMonthlyTokens', 500000)).toBe('500,000')
  })

  it('keeps non-numeric values (plan names) as-is', () => {
    expect(formatWorkspaceLimitValue('plan', 'ENTERPRISE')).toBe('ENTERPRISE')
    expect(formatWorkspaceLimitValue('plan', 'PRO')).toBe('PRO')
  })

  it('renders null/undefined as default', () => {
    expect(formatWorkspaceLimitValue('aiDailyCalls', null)).toBe('default')
    expect(formatWorkspaceLimitValue('aiDailyCalls', undefined)).toBe('default')
  })
})

describe('getWorkspaceLimitParts', () => {
  const changes = {
    plan:              { from: 'PRO', to: 'ENTERPRISE' },
    aiDailyCalls:      { from: null, to: 9000 },
    aiMonthlyTokens:   { from: 500000, to: 100000000 },
    aiMaxOutputTokens: { from: null, to: 8192 },
  }

  it('returns friendly before → after parts in order', () => {
    expect(getWorkspaceLimitParts(changes)).toEqual([
      { field: 'plan',              label: 'Plan',                      from: 'PRO',     to: 'ENTERPRISE' },
      { field: 'aiDailyCalls',      label: 'AI calls / day',            from: 'default', to: '9,000' },
      { field: 'aiMonthlyTokens',   label: 'AI tokens / month',         from: '500,000', to: '100M' },
      { field: 'aiMaxOutputTokens', label: 'AI max output / response',  from: 'default', to: '8,192' },
    ])
  })

  it('skips malformed entries and falls back to the raw field name', () => {
    const parts = getWorkspaceLimitParts({
      aiDailyCalls: { from: null, to: 9000 },
      maxMembers:   'not-an-object',
      weirdField:   { from: 1 },
    })
    expect(parts).toEqual([
      { field: 'aiDailyCalls', label: 'AI calls / day', from: 'default', to: '9,000' },
    ])
  })

  it('returns [] for empty, non-object, or missing changes', () => {
    expect(getWorkspaceLimitParts(undefined)).toEqual([])
    expect(getWorkspaceLimitParts(null)).toEqual([])
    expect(getWorkspaceLimitParts({})).toEqual([])
    expect(getWorkspaceLimitParts('nope')).toEqual([])
  })
})
