import { describe, it, expect } from 'vitest'
import { features, plans, faqs } from '@/constants/pricing.constants'

describe('pricing.constants', () => {
  describe('features', () => {
    it('has 7 feature comparison items', () => {
      expect(features).toHaveLength(7)
    })

    it('each feature has name, free, pro, business flags', () => {
      features.forEach(f => {
        expect(f.name).toBeTruthy()
        expect(typeof f.free).toBe('boolean')
        expect(typeof f.pro).toBe('boolean')
        expect(typeof f.business).toBe('boolean')
      })
    })

    it('Unlimited Projects is free=false, pro=true, business=true', () => {
      const unlimited = features.find(f => f.name === 'Unlimited Projects')
      expect(unlimited).toBeDefined()
      expect(unlimited!.free).toBe(false)
      expect(unlimited!.pro).toBe(true)
      expect(unlimited!.business).toBe(true)
    })

    it('Advanced Analytics is business-only', () => {
      const analytics = features.find(f => f.name === 'Advanced Analytics')
      expect(analytics).toBeDefined()
      expect(analytics!.free).toBe(false)
      expect(analytics!.pro).toBe(false)
      expect(analytics!.business).toBe(true)
    })
  })

  describe('plans', () => {
    it('has 3 plans', () => {
      expect(plans).toHaveLength(3)
    })

    it('Free plan has correct price', () => {
      const free = plans.find(p => p.name === 'Free')
      expect(free).toBeDefined()
      expect(free!.price).toBe('Free')
      expect(free!.highlighted).toBe(false)
    })

    it('Pro plan is highlighted', () => {
      const pro = plans.find(p => p.name === 'Pro')
      expect(pro).toBeDefined()
      expect(pro!.highlighted).toBe(true)
      expect(pro!.price).toBe('$12/mo')
    })

    it('Business plan price', () => {
      const biz = plans.find(p => p.name === 'Business')
      expect(biz).toBeDefined()
      expect(biz!.price).toBe('$49/mo')
    })

    it('each plan has features array', () => {
      plans.forEach(p => {
        expect(Array.isArray(p.features)).toBe(true)
        expect(p.features.length).toBeGreaterThan(0)
      })
    })
  })

  describe('faqs', () => {
    it('has 5 FAQ items', () => {
      expect(faqs).toHaveLength(5)
    })

    it('each FAQ has q and a', () => {
      faqs.forEach(faq => {
        expect(faq.q).toBeTruthy()
        expect(faq.a).toBeTruthy()
      })
    })
  })
})
