import { describe, it, expect } from 'vitest'
import { INTENT_OPTIONS, PRIORITY_COLORS, INITIAL_FORM_DATA } from '@/constants/taskForm.constants'

describe('taskForm.constants', () => {
  describe('INTENT_OPTIONS', () => {
    it('has 5 intent options', () => {
      expect(INTENT_OPTIONS).toHaveLength(5)
    })

    it('includes all expected intents', () => {
      const values = INTENT_OPTIONS.map(o => o.value)
      expect(values).toContain('EXECUTION')
      expect(values).toContain('PLANNING')
      expect(values).toContain('REVIEW')
      expect(values).toContain('LEARNING')
      expect(values).toContain('COMMUNICATION')
    })

    it('has label, description, and activeClass for each', () => {
      INTENT_OPTIONS.forEach(opt => {
        expect(opt.label).toBeTruthy()
        expect(opt.description).toBeTruthy()
        expect(opt.activeClass).toBeTruthy()
        expect(opt.icon).toBeTruthy()
      })
    })
  })

  describe('PRIORITY_COLORS', () => {
    it('has 4 priority levels', () => {
      expect(Object.keys(PRIORITY_COLORS)).toHaveLength(4)
    })

    it('includes URGENT, HIGH, MEDIUM, LOW', () => {
      expect(PRIORITY_COLORS.URGENT).toBeTruthy()
      expect(PRIORITY_COLORS.HIGH).toBeTruthy()
      expect(PRIORITY_COLORS.MEDIUM).toBeTruthy()
      expect(PRIORITY_COLORS.LOW).toBeTruthy()
    })

    it('each color class includes bg, text, and border', () => {
      Object.values(PRIORITY_COLORS).forEach(color => {
        expect(color).toContain('bg-')
        expect(color).toContain('text-')
        expect(color).toContain('border-')
      })
    })
  })

  describe('INITIAL_FORM_DATA', () => {
    it('has default title as empty string', () => {
      expect(INITIAL_FORM_DATA.title).toBe('')
    })

    it('has default priority as MEDIUM', () => {
      expect(INITIAL_FORM_DATA.priority).toBe('MEDIUM')
    })

    it('has default status as TODO', () => {
      expect(INITIAL_FORM_DATA.status).toBe('TODO')
    })

    it('has default intent as EXECUTION', () => {
      expect(INITIAL_FORM_DATA.intent).toBe('EXECUTION')
    })

    it('has empty assigneeIds and labelIds', () => {
      expect(INITIAL_FORM_DATA.assigneeIds).toEqual([])
      expect(INITIAL_FORM_DATA.labelIds).toEqual([])
    })

    it('has focusRequired as false', () => {
      expect(INITIAL_FORM_DATA.focusRequired).toBe(false)
    })
  })
})
