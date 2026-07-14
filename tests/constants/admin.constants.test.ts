import { describe, it, expect } from 'vitest'
import { TASK_STATUS_COLORS, FEATURE_STATUS_COLORS, PLAN_COLORS } from '@/constants/admin.constants'

describe('admin.constants', () => {
  describe('TASK_STATUS_COLORS', () => {
    it('has 6 status colors', () => {
      expect(Object.keys(TASK_STATUS_COLORS)).toHaveLength(6)
    })

    it('includes all task statuses', () => {
      expect(TASK_STATUS_COLORS.TODO).toBeTruthy()
      expect(TASK_STATUS_COLORS.IN_PROGRESS).toBeTruthy()
      expect(TASK_STATUS_COLORS.IN_REVIEW).toBeTruthy()
      expect(TASK_STATUS_COLORS.COMPLETED).toBeTruthy()
      expect(TASK_STATUS_COLORS.CANCELLED).toBeTruthy()
      expect(TASK_STATUS_COLORS.BLOCKED).toBeTruthy()
    })

    it('each color includes text and bg classes', () => {
      Object.values(TASK_STATUS_COLORS).forEach(color => {
        expect(color).toContain('text-')
        expect(color).toContain('bg-')
      })
    })
  })

  describe('FEATURE_STATUS_COLORS', () => {
    it('has 5 feature statuses', () => {
      expect(Object.keys(FEATURE_STATUS_COLORS)).toHaveLength(5)
    })

    it('includes PENDING, APPROVED, REJECTED, PLANNED, COMPLETED', () => {
      expect(FEATURE_STATUS_COLORS.PENDING).toBeTruthy()
      expect(FEATURE_STATUS_COLORS.APPROVED).toBeTruthy()
      expect(FEATURE_STATUS_COLORS.REJECTED).toBeTruthy()
      expect(FEATURE_STATUS_COLORS.PLANNED).toBeTruthy()
      expect(FEATURE_STATUS_COLORS.COMPLETED).toBeTruthy()
    })
  })

  describe('PLAN_COLORS', () => {
    it('has 4 plan colors', () => {
      expect(Object.keys(PLAN_COLORS)).toHaveLength(4)
    })

    it('includes FREE, PRO, BUSINESS, ENTERPRISE', () => {
      expect(PLAN_COLORS.FREE).toBeTruthy()
      expect(PLAN_COLORS.PRO).toBeTruthy()
      expect(PLAN_COLORS.BUSINESS).toBeTruthy()
      expect(PLAN_COLORS.ENTERPRISE).toBeTruthy()
    })
  })
})
