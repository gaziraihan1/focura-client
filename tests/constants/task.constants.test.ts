import { describe, it, expect } from 'vitest'
import { STATUS_OPTIONS, PERSONAL_TASK_STATUS_OPTIONS, STATUS_LABELS } from '@/constants/task.constants'

describe('task.constants', () => {
  describe('STATUS_OPTIONS', () => {
    it('has 6 status options', () => {
      expect(STATUS_OPTIONS).toHaveLength(6)
    })

    it('includes all expected statuses', () => {
      const values = STATUS_OPTIONS.map(s => s.value)
      expect(values).toContain('TODO')
      expect(values).toContain('IN_PROGRESS')
      expect(values).toContain('IN_REVIEW')
      expect(values).toContain('BLOCKED')
      expect(values).toContain('COMPLETED')
      expect(values).toContain('CANCELLED')
    })

    it('has labels for each option', () => {
      STATUS_OPTIONS.forEach(opt => {
        expect(opt.label).toBeTruthy()
        expect(typeof opt.label).toBe('string')
      })
    })
  })

  describe('PERSONAL_TASK_STATUS_OPTIONS', () => {
    it('has 3 status options', () => {
      expect(PERSONAL_TASK_STATUS_OPTIONS).toHaveLength(3)
    })

    it('includes TODO, IN_PROGRESS, COMPLETED', () => {
      const values = PERSONAL_TASK_STATUS_OPTIONS.map(s => s.value)
      expect(values).toEqual(['TODO', 'IN_PROGRESS', 'COMPLETED'])
    })
  })

  describe('STATUS_LABELS', () => {
    it('maps all 6 statuses to labels', () => {
      expect(Object.keys(STATUS_LABELS)).toHaveLength(6)
    })

    it('maps TODO to "To Do"', () => {
      expect(STATUS_LABELS.TODO).toBe('To Do')
    })

    it('maps IN_PROGRESS to "In Progress"', () => {
      expect(STATUS_LABELS.IN_PROGRESS).toBe('In Progress')
    })

    it('maps COMPLETED to "Completed"', () => {
      expect(STATUS_LABELS.COMPLETED).toBe('Completed')
    })
  })
})
