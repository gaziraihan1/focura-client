import { describe, it, expect } from 'vitest'
import { INTENT_OPTIONS, ENERGY_OPTIONS, PRIORITY_COLORS } from '@/constants/intent.constants'

describe('intent.constants', () => {
  describe('INTENT_OPTIONS', () => {
    it('has 5 intent options', () => {
      expect(INTENT_OPTIONS).toHaveLength(5)
    })

    it('each option has value, label, icon, description, activeClass', () => {
      INTENT_OPTIONS.forEach(opt => {
        expect(opt.value).toBeTruthy()
        expect(opt.label).toBeTruthy()
        expect(opt.icon).toBeTruthy()
        expect(opt.description).toBeTruthy()
        expect(opt.activeClass).toBeTruthy()
      })
    })

    it('EXECUTION option has correct value', () => {
      const exec = INTENT_OPTIONS.find(o => o.value === 'EXECUTION')
      expect(exec).toBeDefined()
      expect(exec!.label).toBe('Execution')
    })
  })

  describe('ENERGY_OPTIONS', () => {
    it('has 3 energy options', () => {
      expect(ENERGY_OPTIONS).toHaveLength(3)
    })

    it('includes LOW, MEDIUM, HIGH', () => {
      const values = ENERGY_OPTIONS.map(o => o.value)
      expect(values).toEqual(['LOW', 'MEDIUM', 'HIGH'])
    })

    it('each option has label and className', () => {
      ENERGY_OPTIONS.forEach(opt => {
        expect(opt.label).toBeTruthy()
        expect(opt.className).toContain('border-')
        expect(opt.className).toContain('bg-')
        expect(opt.className).toContain('text-')
      })
    })
  })

  describe('PRIORITY_COLORS', () => {
    it('has 4 priority colors', () => {
      expect(Object.keys(PRIORITY_COLORS)).toHaveLength(4)
    })

    it('each color includes bg, text, border classes', () => {
      Object.values(PRIORITY_COLORS).forEach(color => {
        expect(color).toContain('bg-')
        expect(color).toContain('text-')
        expect(color).toContain('border-')
      })
    })
  })
})
