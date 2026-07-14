import { describe, it, expect } from 'vitest'

const { API_SECTIONS, ALL_ENDPOINTS, findEndpoint, findSection, API_BASE_URL } = await import('@/lib/apiData')

describe('apiData exports', () => {
  it('exports API_BASE_URL', () => {
    expect(API_BASE_URL).toBe('https://focura-backend-vr75.onrender.com')
  })

  it('API_SECTIONS is a non-empty array', () => {
    expect(Array.isArray(API_SECTIONS)).toBe(true)
    expect(API_SECTIONS.length).toBeGreaterThan(0)
  })

  it('ALL_ENDPOINTS contains all endpoints from all sections', () => {
    const manualCount = API_SECTIONS.reduce((sum, s) => sum + s.endpoints.length, 0)
    expect(ALL_ENDPOINTS.length).toBe(manualCount)
  })

  it('every endpoint has required fields', () => {
    for (const ep of ALL_ENDPOINTS) {
      expect(ep).toHaveProperty('id')
      expect(ep).toHaveProperty('method')
      expect(ep).toHaveProperty('path')
      expect(ep).toHaveProperty('description')
      expect(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).toContain(ep.method)
    }
  })

  it('every section has required fields', () => {
    for (const s of API_SECTIONS) {
      expect(s).toHaveProperty('id')
      expect(s).toHaveProperty('title')
      expect(s).toHaveProperty('description')
      expect(s).toHaveProperty('endpoints')
      expect(Array.isArray(s.endpoints)).toBe(true)
    }
  })
})

describe('findEndpoint', () => {
  it('returns the endpoint for a valid id', () => {
    const ep = findEndpoint('auth-register')
    expect(ep).toBeDefined()
    expect(ep!.id).toBe('auth-register')
    expect(ep!.method).toBe('POST')
  })

  it('returns undefined for a nonexistent id', () => {
    expect(findEndpoint('nonexistent-id')).toBeUndefined()
  })

  it('is case-sensitive', () => {
    const ep = findEndpoint('Auth-Register')
    expect(ep).toBeUndefined()
  })

  it('finds any known endpoint', () => {
    const sampleIds = ALL_ENDPOINTS.slice(0, 5).map((e) => e.id)
    for (const id of sampleIds) {
      expect(findEndpoint(id)).toBeDefined()
    }
  })
})

describe('findSection', () => {
  it('returns the section for a valid id', () => {
    const s = findSection('auth')
    expect(s).toBeDefined()
    expect(s!.id).toBe('auth')
    expect(s!.title).toBeDefined()
  })

  it('returns undefined for a nonexistent id', () => {
    expect(findSection('nonexistent')).toBeUndefined()
  })

  it('is case-sensitive', () => {
    expect(findSection('Authentication')).toBeUndefined()
  })

  it('finds every section by iterating', () => {
    for (const s of API_SECTIONS) {
      expect(findSection(s.id)).toBe(s)
    }
  })
})
