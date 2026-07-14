import { describe, it, expect } from 'vitest'

const { TEMPLATES, CATEGORY_META, COMPLEXITY_META, filterTemplates, ALL_CATEGORIES } = await import('@/lib/templatesData')

describe('static data exports', () => {
  it('TEMPLATES is a non-empty array', () => {
    expect(Array.isArray(TEMPLATES)).toBe(true)
    expect(TEMPLATES.length).toBeGreaterThan(0)
  })

  it('every template has required fields', () => {
    for (const t of TEMPLATES) {
      expect(t).toHaveProperty('id')
      expect(t).toHaveProperty('title')
      expect(t).toHaveProperty('description')
      expect(t).toHaveProperty('category')
      expect(t).toHaveProperty('complexity')
      expect(Object.keys(CATEGORY_META)).toContain(t.category)
      expect(Object.keys(COMPLEXITY_META)).toContain(t.complexity)
    }
  })

  it('CATEGORY_META has entries for all categories', () => {
    const categories = [...new Set(TEMPLATES.map((t) => t.category))]
    for (const cat of categories) {
      expect(CATEGORY_META[cat]).toBeDefined()
      expect(CATEGORY_META[cat]).toHaveProperty('label')
      expect(CATEGORY_META[cat]).toHaveProperty('description')
    }
  })

  it('COMPLEXITY_META has all complexity levels', () => {
    expect(COMPLEXITY_META).toHaveProperty('starter')
    expect(COMPLEXITY_META).toHaveProperty('intermediate')
    expect(COMPLEXITY_META).toHaveProperty('advanced')
  })

  it('ALL_CATEGORIES includes "all" and all category keys', () => {
    expect(ALL_CATEGORIES).toContain('all')
    const keys = Object.keys(CATEGORY_META)
    for (const k of keys) {
      expect(ALL_CATEGORIES).toContain(k)
    }
  })
})

describe('filterTemplates', () => {
  it('returns all templates when category is "all" and search is empty', () => {
    const result = filterTemplates(TEMPLATES, 'all', '')
    expect(result).toEqual(TEMPLATES)
    expect(result.length).toBe(TEMPLATES.length)
  })

  it('filters by category', () => {
    const result = filterTemplates(TEMPLATES, 'engineering', '')
    expect(result.every((t) => t.category === 'engineering')).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns empty array when no templates match category', () => {
    const result = filterTemplates([], 'engineering', '')
    expect(result).toEqual([])
  })

  it('filters by search term matching title', () => {
    const result = filterTemplates(TEMPLATES, 'all', 'Sprint')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((t) => t.title.toLowerCase().includes('sprint'))).toBe(true)
  })

  it('filters by search term matching description', () => {
    const result = filterTemplates(TEMPLATES, 'all', 'editorial')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((t) => t.description.toLowerCase().includes('editorial'))).toBe(true)
  })

  it('filters by search term matching tags', () => {
    const result = filterTemplates(TEMPLATES, 'all', 'scrum')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some((t) => t.tags.some((tag) => tag.includes('scrum')))).toBe(true)
  })

  it('combines category and search filters', () => {
    const result = filterTemplates(TEMPLATES, 'product', 'roadmap')
    expect(result.every((t) => t.category === 'product')).toBe(true)
    expect(result.some((t) => t.title.toLowerCase().includes('roadmap'))).toBe(true)
  })

  it('is case-insensitive for search', () => {
    const lower = filterTemplates(TEMPLATES, 'all', 'sprint')
    const upper = filterTemplates(TEMPLATES, 'all', 'SPRINT')
    expect(lower).toEqual(upper)
  })

  it('returns empty array when search matches nothing', () => {
    const result = filterTemplates(TEMPLATES, 'all', 'xyznonexistent123')
    expect(result).toEqual([])
  })
})
