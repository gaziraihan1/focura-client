import { describe, it, expect } from 'vitest'
import { COLOR_MAP, GUIDE_SECTIONS, PLATFORM_OVERVIEW, TASK_STATUSES, MEMBER_ROLES, PROJECT_VIEW_MODES, GETTING_STARTED_CARDS } from '@/constants/guides.constants'

describe('guides.constants', () => {
  describe('COLOR_MAP', () => {
    it('has 10 color themes', () => {
      expect(Object.keys(COLOR_MAP)).toHaveLength(10)
    })

    it('includes expected colors', () => {
      expect(COLOR_MAP.blue).toBeTruthy()
      expect(COLOR_MAP.violet).toBeTruthy()
      expect(COLOR_MAP.emerald).toBeTruthy()
      expect(COLOR_MAP.rose).toBeTruthy()
      expect(COLOR_MAP.teal).toBeTruthy()
    })

    it('each color has bg, text, border, pill', () => {
      Object.values(COLOR_MAP).forEach(color => {
        expect(color.bg).toBeTruthy()
        expect(color.text).toBeTruthy()
        expect(color.border).toBeTruthy()
        expect(color.pill).toBeTruthy()
      })
    })
  })

  describe('GUIDE_SECTIONS', () => {
    it('has 13 guide sections', () => {
      expect(GUIDE_SECTIONS).toHaveLength(13)
    })

    it('each section has id, icon, label, color, title, subtitle', () => {
      GUIDE_SECTIONS.forEach(section => {
        expect(section.id).toBeTruthy()
        expect(section.icon).toBeTruthy()
        expect(section.label).toBeTruthy()
        expect(section.color).toBeTruthy()
        expect(section.title).toBeTruthy()
        expect(section.subtitle).toBeTruthy()
      })
    })

    it('first section is "getting-started"', () => {
      expect(GUIDE_SECTIONS[0].id).toBe('getting-started')
      expect(GUIDE_SECTIONS[0].label).toBe('Getting Started')
    })

    it('last section is "billing"', () => {
      expect(GUIDE_SECTIONS[12].id).toBe('billing')
      expect(GUIDE_SECTIONS[12].label).toBe('Billing & Plans')
    })
  })

  describe('PLATFORM_OVERVIEW', () => {
    it('has 8 platform items', () => {
      expect(PLATFORM_OVERVIEW).toHaveLength(8)
    })

    it('each item has name and desc', () => {
      PLATFORM_OVERVIEW.forEach(item => {
        expect(item.name).toBeTruthy()
        expect(item.desc).toBeTruthy()
      })
    })

    it('includes Workspace, Projects, Tasks', () => {
      const names = PLATFORM_OVERVIEW.map(i => i.name)
      expect(names).toContain('Workspace')
      expect(names).toContain('Projects')
      expect(names).toContain('Tasks')
    })
  })

  describe('TASK_STATUSES', () => {
    it('has 5 task statuses', () => {
      expect(TASK_STATUSES).toHaveLength(5)
    })

    it('each status has label and color', () => {
      TASK_STATUSES.forEach(status => {
        expect(status.label).toBeTruthy()
        expect(status.color).toBeTruthy()
      })
    })
  })

  describe('MEMBER_ROLES', () => {
    it('has 3 member roles', () => {
      expect(MEMBER_ROLES).toHaveLength(3)
    })

    it('includes Owner, Admin, Member', () => {
      const names = MEMBER_ROLES.map(r => r.name)
      expect(names).toContain('Owner')
      expect(names).toContain('Admin')
      expect(names).toContain('Member')
    })

    it('each role has name, color, icon, perms', () => {
      MEMBER_ROLES.forEach(role => {
        expect(role.name).toBeTruthy()
        expect(role.color).toBeTruthy()
        expect(role.icon).toBeTruthy()
        expect(Array.isArray(role.perms)).toBe(true)
        expect(role.perms.length).toBeGreaterThan(0)
      })
    })
  })

  describe('PROJECT_VIEW_MODES', () => {
    it('has 3 view modes', () => {
      expect(PROJECT_VIEW_MODES).toHaveLength(3)
    })

    it('each mode has badge, color, desc', () => {
      PROJECT_VIEW_MODES.forEach(mode => {
        expect(mode.badge).toBeTruthy()
        expect(mode.color).toBeTruthy()
        expect(mode.desc).toBeTruthy()
      })
    })
  })

  describe('GETTING_STARTED_CARDS', () => {
    it('has 4 cards', () => {
      expect(GETTING_STARTED_CARDS).toHaveLength(4)
    })

    it('each card has icon, color, title, desc', () => {
      GETTING_STARTED_CARDS.forEach(card => {
        expect(card.icon).toBeTruthy()
        expect(card.color).toBeTruthy()
        expect(card.title).toBeTruthy()
        expect(card.desc).toBeTruthy()
      })
    })

    it('includes "Create a Workspace"', () => {
      const titles = GETTING_STARTED_CARDS.map(c => c.title)
      expect(titles).toContain('Create a Workspace')
    })
  })
})
