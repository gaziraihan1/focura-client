import { describe, it, expect } from 'vitest'
import { EDITOR_TOOLS, CHARACTER_LIMITS } from '@/constants/announcement.constants'

describe('announcement.constants', () => {
  describe('EDITOR_TOOLS', () => {
    it('has 5 editor tools', () => {
      expect(EDITOR_TOOLS).toHaveLength(5)
    })

    it('includes bold, italic, mono, link, break', () => {
      const ids = EDITOR_TOOLS.map(t => t.id)
      expect(ids).toContain('bold')
      expect(ids).toContain('italic')
      expect(ids).toContain('mono')
      expect(ids).toContain('link')
      expect(ids).toContain('break')
    })

    it('each tool has id, icon, label', () => {
      EDITOR_TOOLS.forEach(tool => {
        expect(tool.id).toBeTruthy()
        expect(tool.icon).toBeTruthy()
        expect(tool.label).toBeTruthy()
      })
    })

    it('break tool has insert property', () => {
      const breakTool = EDITOR_TOOLS.find(t => t.id === 'break')
      expect(breakTool).toBeDefined()
      expect(breakTool!.insert).toBe('>')
    })

    it('bold tool has wrap markers', () => {
      const bold = EDITOR_TOOLS.find(t => t.id === 'bold')
      expect(bold).toBeDefined()
      expect(bold!.wrap).toEqual(['**', '**'])
    })
  })

  describe('CHARACTER_LIMITS', () => {
    it('has WARNING, DANGER, MAX limits', () => {
      expect(CHARACTER_LIMITS.WARNING).toBe(7000)
      expect(CHARACTER_LIMITS.DANGER).toBe(9000)
      expect(CHARACTER_LIMITS.MAX).toBe(10000)
    })

    it('WARNING < DANGER < MAX', () => {
      expect(CHARACTER_LIMITS.WARNING).toBeLessThan(CHARACTER_LIMITS.DANGER)
      expect(CHARACTER_LIMITS.DANGER).toBeLessThan(CHARACTER_LIMITS.MAX)
    })
  })
})
