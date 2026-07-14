import { describe, it, expect } from 'vitest'
import { PLAN_META, GAINED_FEATURES } from '@/constants/billing.success.constants'

describe('billing.success.constants', () => {
  describe('PLAN_META', () => {
    it('has 3 plans', () => {
      expect(Object.keys(PLAN_META)).toHaveLength(3)
    })

    it('FREE plan has correct properties', () => {
      const free = PLAN_META.FREE
      expect(free.label).toBe('Free')
      expect(free.icon).toBeNull()
      expect(free.color).toBe('text-muted-foreground')
      expect(free.bgColor).toBe('bg-muted')
      expect(free.borderColor).toBe('border-border')
    })

    it('FREE plan features', () => {
      const features = PLAN_META.FREE.features
      expect(features.members).toBe('5 members')
      expect(features.storage).toBe('1 GB storage')
      expect(features.projects).toBe('3 projects')
      expect(features.analytics).toBe(false)
      expect(features.api).toBe(false)
      expect(features.support).toBe(false)
    })

    it('PRO plan has icon and correct features', () => {
      const pro = PLAN_META.PRO
      expect(pro.label).toBe('Pro')
      expect(pro.icon).toBeTruthy()
      expect(pro.features.members).toBe('25 members')
      expect(pro.features.analytics).toBe(true)
      expect(pro.features.api).toBe(false)
    })

    it('BUSINESS plan has all premium features', () => {
      const biz = PLAN_META.BUSINESS
      expect(biz.label).toBe('Business')
      expect(biz.features.members).toBe('Unlimited members')
      expect(biz.features.analytics).toBe(true)
      expect(biz.features.api).toBe(true)
      expect(biz.features.support).toBe(true)
    })
  })

  describe('GAINED_FEATURES', () => {
    it('has 3 upgrade paths', () => {
      expect(Object.keys(GAINED_FEATURES)).toHaveLength(3)
    })

    it('FREE→PRO has 5 features', () => {
      expect(GAINED_FEATURES['FREE→PRO']).toHaveLength(5)
    })

    it('FREE→BUSINESS has 7 features', () => {
      expect(GAINED_FEATURES['FREE→BUSINESS']).toHaveLength(7)
    })

    it('PRO→BUSINESS has 4 features', () => {
      expect(GAINED_FEATURES['PRO→BUSINESS']).toHaveLength(4)
    })

    it('each feature has icon, label, and detail', () => {
      Object.values(GAINED_FEATURES).forEach(features => {
        features.forEach(f => {
          expect(f.icon).toBeTruthy()
          expect(f.label).toBeTruthy()
          expect(f.detail).toBeTruthy()
        })
      })
    })

    it('FREE→PRO includes "5× more members"', () => {
      const labels = GAINED_FEATURES['FREE→PRO'].map(f => f.label)
      expect(labels).toContain('5× more members')
    })

    it('FREE→BUSINESS includes "API access"', () => {
      const labels = GAINED_FEATURES['FREE→BUSINESS'].map(f => f.label)
      expect(labels).toContain('API access')
    })
  })
})
