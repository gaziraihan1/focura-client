import { describe, it, expect } from 'vitest'
import { CATEGORY_LABELS, CATEGORY_COLORS, ROADMAP_ITEMS } from '@/lib/roadmapData'

describe('lib/roadmapData', () => {
  describe('CATEGORY_LABELS', () => {
    it('has 6 categories', () => {
      expect(Object.keys(CATEGORY_LABELS)).toHaveLength(6)
    })

    it('maps each category to a label', () => {
      expect(CATEGORY_LABELS.core).toBe('Core')
      expect(CATEGORY_LABELS.productivity).toBe('Productivity')
      expect(CATEGORY_LABELS.collaboration).toBe('Collaboration')
      expect(CATEGORY_LABELS.analytics).toBe('Analytics')
      expect(CATEGORY_LABELS.integration).toBe('Integration')
      expect(CATEGORY_LABELS.platform).toBe('Platform')
    })
  })

  describe('CATEGORY_COLORS', () => {
    it('has 6 categories', () => {
      expect(Object.keys(CATEGORY_COLORS)).toHaveLength(6)
    })

    it('each color is a hex string', () => {
      Object.values(CATEGORY_COLORS).forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })
  })

  describe('ROADMAP_ITEMS', () => {
    it('has multiple roadmap items', () => {
      expect(ROADMAP_ITEMS.length).toBeGreaterThan(0)
    })

    it('each item has required fields', () => {
      ROADMAP_ITEMS.forEach(item => {
        expect(item.id).toBeTruthy()
        expect(item.title).toBeTruthy()
        expect(item.description).toBeTruthy()
        expect(item.detail).toBeTruthy()
        expect(item.status).toBeTruthy()
        expect(item.category).toBeTruthy()
        expect(item.quarter).toBeTruthy()
        expect(item.icon).toBeTruthy()
        expect(Array.isArray(item.highlights)).toBe(true)
        expect(item.highlights.length).toBeGreaterThan(0)
      })
    })

    it('each item has valid status', () => {
      const validStatuses = ['completed', 'in-progress', 'planned', 'future']
      ROADMAP_ITEMS.forEach(item => {
        expect(validStatuses).toContain(item.status)
      })
    })

    it('each item has valid category', () => {
      const validCategories = ['core', 'productivity', 'collaboration', 'analytics', 'integration', 'platform']
      ROADMAP_ITEMS.forEach(item => {
        expect(validCategories).toContain(item.category)
      })
    })

    it('has unique ids', () => {
      const ids = ROADMAP_ITEMS.map(i => i.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('includes "workspace-foundation" item', () => {
      const item = ROADMAP_ITEMS.find(i => i.id === 'workspace-foundation')
      expect(item).toBeDefined()
      expect(item!.status).toBe('completed')
    })
  })
})
