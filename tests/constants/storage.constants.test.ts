import { describe, it, expect } from 'vitest'
import { storageBreakdown, FILTER_OPTIONS, plans } from '@/constants/storage.constants'

describe('storage.constants', () => {
  describe('storageBreakdown', () => {
    it('returns 3 data items', () => {
      const result = storageBreakdown({
        breakdown: { attachments: 100, projectFiles: 200, workspaceFiles: 300, total: 600 },
      })
      expect(result.data).toHaveLength(3)
    })

    it('calculates percentages correctly', () => {
      const result = storageBreakdown({
        breakdown: { attachments: 100, projectFiles: 200, workspaceFiles: 300, total: 600 },
      })
      expect(result.data[0].percentage).toBe(17) // 100/600 = 16.67 -> 17
      expect(result.data[1].percentage).toBe(33) // 200/600 = 33.33 -> 33
      expect(result.data[2].percentage).toBe(50) // 300/600 = 50
    })

    it('handles zero total', () => {
      const result = storageBreakdown({
        breakdown: { attachments: 0, projectFiles: 0, workspaceFiles: 0, total: 0 },
      })
      result.data.forEach(item => {
        expect(item.percentage).toBe(0)
      })
    })

    it('each item has label, value, percentage, color, icon, description', () => {
      const result = storageBreakdown({
        breakdown: { attachments: 50, projectFiles: 50, workspaceFiles: 50, total: 150 },
      })
      result.data.forEach(item => {
        expect(item.label).toBeTruthy()
        expect(item.value).toBeGreaterThanOrEqual(0)
        expect(item.percentage).toBeGreaterThanOrEqual(0)
        expect(item.color).toBeTruthy()
        expect(item.icon).toBeTruthy()
        expect(item.description).toBeTruthy()
      })
    })

    it('Task Attachments has correct label', () => {
      const result = storageBreakdown({
        breakdown: { attachments: 10, projectFiles: 20, workspaceFiles: 30, total: 60 },
      })
      expect(result.data[0].label).toBe('Task Attachments')
      expect(result.data[0].color).toBe('bg-blue-500')
    })

    it('Project Files has correct label', () => {
      const result = storageBreakdown({
        breakdown: { attachments: 10, projectFiles: 20, workspaceFiles: 30, total: 60 },
      })
      expect(result.data[1].label).toBe('Project Files')
      expect(result.data[1].color).toBe('bg-purple-500')
    })

    it('Workspace Files has correct label', () => {
      const result = storageBreakdown({
        breakdown: { attachments: 10, projectFiles: 20, workspaceFiles: 30, total: 60 },
      })
      expect(result.data[2].label).toBe('Workspace Files')
      expect(result.data[2].color).toBe('bg-green-500')
    })
  })

  describe('FILTER_OPTIONS', () => {
    it('has 6 filter options', () => {
      expect(FILTER_OPTIONS).toHaveLength(6)
    })

    it('includes all expected filters', () => {
      const values = FILTER_OPTIONS.map(o => o.value)
      expect(values).toContain('all')
      expect(values).toContain('images')
      expect(values).toContain('videos')
      expect(values).toContain('pdfs')
      expect(values).toContain('documents')
      expect(values).toContain('other')
    })

    it('first option is "all"', () => {
      expect(FILTER_OPTIONS[0]).toEqual({ value: 'all', label: 'All Files' })
    })
  })

  describe('plans', () => {
    it('has 3 plans', () => {
      expect(plans).toHaveLength(3)
    })

    it('PRO plan is popular', () => {
      const pro = plans.find(p => p.name === 'PRO')
      expect(pro).toBeDefined()
      expect(pro!.popular).toBe(true)
    })

    it('each plan has name, icon, description', () => {
      plans.forEach(plan => {
        expect(plan.name).toBeTruthy()
        expect(plan.icon).toBeTruthy()
        expect(plan.description).toBeTruthy()
      })
    })
  })
})
