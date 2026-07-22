import { describe, it, expect } from 'vitest'
import { features, metrics, cases } from '@/constants/features.constants'

describe('features.constants', () => {
  describe('features', () => {
    it('has 3 feature sections', () => {
      expect(features).toHaveLength(3)
    })

    it('each feature has title, desc, points, img', () => {
      features.forEach(f => {
        expect(f.title).toBeTruthy()
        expect(f.desc).toBeTruthy()
        expect(Array.isArray(f.points)).toBe(true)
        expect(f.points.length).toBe(3)
        expect(f.img).toBeTruthy()
      })
    })

    it('first feature is about workflow visualization', () => {
      expect(features[0].title).toContain('Visualize')
    })
  })

  describe('metrics', () => {
    it('has 4 metrics', () => {
      expect(metrics).toHaveLength(4)
    })

    it('each metric has value and label', () => {
      metrics.forEach(m => {
        expect(m.value).toBeTruthy()
        expect(m.label).toBeTruthy()
      })
    })

    it('includes "Faster Task Completion"', () => {
      const m = metrics.find(m => m.label === 'Faster Task Completion')
      expect(m).toBeDefined()
      expect(m!.value).toBe('3×')
    })
  })

  describe('cases', () => {
    it('has 3 use cases', () => {
      expect(cases).toHaveLength(3)
    })

    it('each case has title, desc, img', () => {
      cases.forEach(c => {
        expect(c.title).toBeTruthy()
        expect(c.desc).toBeTruthy()
        expect(c.img).toBeTruthy()
      })
    })

    it('includes Solo Founders, Agencies, Remote Teams', () => {
      const titles = cases.map(c => c.title)
      expect(titles).toContain('Solo Founders')
      expect(titles).toContain('Agencies')
      expect(titles).toContain('Remote Teams')
    })
  })
})
