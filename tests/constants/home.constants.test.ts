import { describe, it, expect } from 'vitest'
import { faqs, features, integrations, plans, testimonials } from '@/constants/home.constants'

describe('home.constants', () => {
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

    it('first FAQ is "What is Focura?"', () => {
      expect(faqs[0].q).toBe('What is Focura?')
    })
  })

  describe('features', () => {
    it('has 3 feature sections', () => {
      expect(features).toHaveLength(3)
    })

    it('each feature has title, desc, image, reverse', () => {
      features.forEach(f => {
        expect(f.title).toBeTruthy()
        expect(f.desc).toBeTruthy()
        expect(f.image).toBeTruthy()
        expect(typeof f.reverse).toBe('boolean')
      })
    })
  })

  describe('integrations', () => {
    it('has 6 integrations', () => {
      expect(integrations).toHaveLength(6)
    })

    it('each integration has name and logo', () => {
      integrations.forEach(i => {
        expect(i.name).toBeTruthy()
        expect(i.logo).toBeTruthy()
      })
    })

    it('includes Slack, Notion, Figma', () => {
      const names = integrations.map(i => i.name)
      expect(names).toContain('Slack')
      expect(names).toContain('Notion')
      expect(names).toContain('Figma')
    })
  })

  describe('plans', () => {
    it('has 3 plans', () => {
      expect(plans).toHaveLength(3)
    })

    it('Pro plan is highlighted', () => {
      const pro = plans.find(p => p.name === 'Pro')
      expect(pro).toBeDefined()
      expect(pro!.highlighted).toBe(true)
    })

    it('each plan has features array', () => {
      plans.forEach(p => {
        expect(Array.isArray(p.features)).toBe(true)
        expect(p.features.length).toBeGreaterThan(0)
      })
    })
  })

  describe('testimonials', () => {
    it('has 3 testimonials', () => {
      expect(testimonials).toHaveLength(3)
    })

    it('each testimonial has name, role, quote, avatar, rating', () => {
      testimonials.forEach(t => {
        expect(t.name).toBeTruthy()
        expect(t.role).toBeTruthy()
        expect(t.quote).toBeTruthy()
        expect(t.avatar).toBeTruthy()
        expect(t.rating).toBe(5)
      })
    })
  })
})
