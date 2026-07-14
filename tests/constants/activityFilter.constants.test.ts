import { describe, it, expect } from 'vitest'
import { ACTION_OPTIONS, ENTITY_OPTIONS, DATE_PRESETS } from '@/constants/activityFilter.constants'

describe('activityFilter.constants', () => {
  describe('ACTION_OPTIONS', () => {
    it('has 11 action options', () => {
      expect(ACTION_OPTIONS).toHaveLength(11)
    })

    it('includes "all" as first option', () => {
      expect(ACTION_OPTIONS[0]).toEqual({ value: 'all', label: 'All Actions' })
    })

    it('includes all expected actions', () => {
      const values = ACTION_OPTIONS.map(o => o.value)
      expect(values).toContain('CREATED')
      expect(values).toContain('UPDATED')
      expect(values).toContain('DELETED')
      expect(values).toContain('COMPLETED')
      expect(values).toContain('COMMENTED')
      expect(values).toContain('ASSIGNED')
      expect(values).toContain('STATUS_CHANGED')
      expect(values).toContain('MOVED')
      expect(values).toContain('PRIORITY_CHANGED')
    })
  })

  describe('ENTITY_OPTIONS', () => {
    it('has 7 entity options', () => {
      expect(ENTITY_OPTIONS).toHaveLength(7)
    })

    it('includes "all" as first option', () => {
      expect(ENTITY_OPTIONS[0]).toEqual({ value: 'all', label: 'All Types' })
    })

    it('includes all expected entity types', () => {
      const values = ENTITY_OPTIONS.map(o => o.value)
      expect(values).toContain('TASK')
      expect(values).toContain('PROJECT')
      expect(values).toContain('WORKSPACE')
      expect(values).toContain('COMMENT')
      expect(values).toContain('FILE')
      expect(values).toContain('MEMBER')
    })
  })

  describe('DATE_PRESETS', () => {
    it('has 5 date presets', () => {
      expect(DATE_PRESETS).toHaveLength(5)
    })

    it('includes expected presets', () => {
      const values = DATE_PRESETS.map(o => o.value)
      expect(values).toContain('today')
      expect(values).toContain('yesterday')
      expect(values).toContain('week')
      expect(values).toContain('month')
      expect(values).toContain('custom')
    })
  })
})
