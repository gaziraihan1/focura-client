import { describe, it, expect } from 'vitest'
import { PLANS, PLAN_RANK, PLAN_META, STATUS_CONFIGS, INVOICE_STATUS_STYLES } from '@/constants/billing.upgrade.constants'

describe('billing.upgrade.constants', () => {
  describe('PLANS', () => {
    it('has 3 plans', () => {
      expect(PLANS).toHaveLength(3)
    })

    it('FREE plan has correct properties', () => {
      const free = PLANS.find(p => p.name === 'FREE')!
      expect(free.displayName).toBe('Free')
      expect(free.price.monthly).toBe(0)
      expect(free.price.yearly).toBe(0)
      expect(free.highlight).toBe(false)
      expect(free.features).toContain('1 workspaces')
    })

    it('PRO plan is highlighted', () => {
      const pro = PLANS.find(p => p.name === 'PRO')!
      expect(pro.displayName).toBe('Pro')
      expect(pro.price.monthly).toBe(1200)
      expect(pro.price.yearly).toBe(12000)
      expect(pro.highlight).toBe(true)
      expect(pro.features).toContain('Unlimited projects')
    })

    it('BUSINESS plan has correct properties', () => {
      const biz = PLANS.find(p => p.name === 'BUSINESS')!
      expect(biz.displayName).toBe('Business')
      expect(biz.price.monthly).toBe(4900)
      expect(biz.price.yearly).toBe(48000)
      expect(biz.highlight).toBe(false)
      expect(biz.features).toContain('Unlimited workspaces')
    })

    it('each plan has name, displayName, icon, price, description, features', () => {
      PLANS.forEach(plan => {
        expect(plan.name).toBeTruthy()
        expect(plan.displayName).toBeTruthy()
        expect(plan.icon).toBeTruthy()
        expect(plan.price.monthly).toBeGreaterThanOrEqual(0)
        expect(plan.price.yearly).toBeGreaterThanOrEqual(0)
        expect(plan.description).toBeTruthy()
        expect(Array.isArray(plan.features)).toBe(true)
        expect(plan.features.length).toBeGreaterThan(0)
      })
    })
  })

  describe('PLAN_RANK', () => {
    it('has correct ranks', () => {
      expect(PLAN_RANK.FREE).toBe(0)
      expect(PLAN_RANK.PRO).toBe(1)
      expect(PLAN_RANK.BUSINESS).toBe(2)
    })

    it('FREE < PRO < BUSINESS', () => {
      expect(PLAN_RANK.FREE).toBeLessThan(PLAN_RANK.PRO)
      expect(PLAN_RANK.PRO).toBeLessThan(PLAN_RANK.BUSINESS)
    })
  })

  describe('PLAN_META', () => {
    it('has 3 plan metas', () => {
      expect(Object.keys(PLAN_META)).toHaveLength(3)
    })

    it('each meta has label and icon', () => {
      Object.values(PLAN_META).forEach(meta => {
        expect(meta.label).toBeTruthy()
        expect(meta.icon).toBeTruthy()
      })
    })
  })

  describe('STATUS_CONFIGS', () => {
    it('has 5 status configs', () => {
      expect(Object.keys(STATUS_CONFIGS)).toHaveLength(5)
    })

    it('includes ACTIVE, TRIALING, PAST_DUE, CANCELED, PAUSED', () => {
      expect(STATUS_CONFIGS.ACTIVE).toBeTruthy()
      expect(STATUS_CONFIGS.TRIALING).toBeTruthy()
      expect(STATUS_CONFIGS.PAST_DUE).toBeTruthy()
      expect(STATUS_CONFIGS.CANCELED).toBeTruthy()
      expect(STATUS_CONFIGS.PAUSED).toBeTruthy()
    })

    it('each config has icon, label, and cls', () => {
      Object.values(STATUS_CONFIGS).forEach(config => {
        expect(config.icon).toBeTruthy()
        expect(config.label).toBeTruthy()
        expect(config.cls).toBeTruthy()
      })
    })

    it('ACTIVE has "Active" label', () => {
      expect(STATUS_CONFIGS.ACTIVE.label).toBe('Active')
    })

    it('CANCELED has "Canceled" label', () => {
      expect(STATUS_CONFIGS.CANCELED.label).toBe('Canceled')
    })
  })

  describe('INVOICE_STATUS_STYLES', () => {
    it('has 5 invoice statuses', () => {
      expect(Object.keys(INVOICE_STATUS_STYLES)).toHaveLength(5)
    })

    it('includes PAID, OPEN, VOID, UNCOLLECTIBLE, DRAFT', () => {
      expect(INVOICE_STATUS_STYLES.PAID).toBeTruthy()
      expect(INVOICE_STATUS_STYLES.OPEN).toBeTruthy()
      expect(INVOICE_STATUS_STYLES.VOID).toBeTruthy()
      expect(INVOICE_STATUS_STYLES.UNCOLLECTIBLE).toBeTruthy()
      expect(INVOICE_STATUS_STYLES.DRAFT).toBeTruthy()
    })

    it('each style includes bg and text classes', () => {
      Object.values(INVOICE_STATUS_STYLES).forEach(style => {
        expect(style).toContain('bg-')
        expect(style).toContain('text-')
      })
    })
  })
})
