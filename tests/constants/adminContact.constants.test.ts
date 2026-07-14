import { describe, it, expect } from 'vitest'
import { STATUS_OPTIONS, CATEGORY_OPTIONS, STATUS_CLASSES, CATEGORY_CLASSES } from '@/constants/adminContact.constants'

describe('adminContact.constants', () => {
  describe('STATUS_OPTIONS', () => {
    it('has 5 status options including "All"', () => {
      expect(STATUS_OPTIONS).toHaveLength(5)
    })

    it('includes empty string for "All Statuses"', () => {
      expect(STATUS_OPTIONS[0]).toEqual({ value: '', label: 'All Statuses' })
    })

    it('includes UNREAD, READ, REPLIED, ARCHIVED', () => {
      const values = STATUS_OPTIONS.map(o => o.value)
      expect(values).toContain('UNREAD')
      expect(values).toContain('READ')
      expect(values).toContain('REPLIED')
      expect(values).toContain('ARCHIVED')
    })
  })

  describe('CATEGORY_OPTIONS', () => {
    it('has 7 category options including "All"', () => {
      expect(CATEGORY_OPTIONS).toHaveLength(7)
    })

    it('includes all expected categories', () => {
      const values = CATEGORY_OPTIONS.map(o => o.value)
      expect(values).toContain('GENERAL')
      expect(values).toContain('BILLING')
      expect(values).toContain('TECHNICAL')
      expect(values).toContain('FEATURE_REQUEST')
      expect(values).toContain('BUG_REPORT')
      expect(values).toContain('OTHER')
    })
  })

  describe('STATUS_CLASSES', () => {
    it('has classes for all 4 statuses', () => {
      expect(Object.keys(STATUS_CLASSES)).toHaveLength(4)
    })

    it('each class includes bg, text, and ring', () => {
      Object.values(STATUS_CLASSES).forEach(cls => {
        expect(cls).toContain('bg-')
        expect(cls).toContain('text-')
        expect(cls).toContain('ring-')
      })
    })
  })

  describe('CATEGORY_CLASSES', () => {
    it('has classes for all 6 categories', () => {
      expect(Object.keys(CATEGORY_CLASSES)).toHaveLength(6)
    })

    it('each class includes bg and text', () => {
      Object.values(CATEGORY_CLASSES).forEach(cls => {
        expect(cls).toContain('bg-')
        expect(cls).toContain('text-')
      })
    })
  })
})
