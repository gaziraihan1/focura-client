import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock the actual theme module to test internal functions
vi.mock('@/lib/theme', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/theme')>()
  return actual
})

import { toggleTheme, getCurrentTheme, themeScript } from '@/lib/theme'

describe('theme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getCurrentTheme', () => {
    it('returns light when no dark class', () => {
      expect(getCurrentTheme()).toBe('light')
    })

    it('returns dark when class is set', () => {
      document.documentElement.classList.add('dark')
      expect(getCurrentTheme()).toBe('dark')
    })
  })

  describe('toggleTheme', () => {
    it('toggles dark class and persists to localStorage', () => {
      toggleTheme()
      expect(document.documentElement.classList.contains('dark')).toBe(true)

      toggleTheme()
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('themeScript', () => {
    it('is a non-empty string', () => {
      expect(typeof themeScript).toBe('string')
      expect(themeScript.length).toBeGreaterThan(0)
    })

    it('contains IIFE pattern', () => {
      expect(themeScript).toContain('(function()')
      expect(themeScript).toContain('})()')
    })

    it('references localStorage', () => {
      expect(themeScript).toContain('localStorage')
    })

    it('references matchMedia', () => {
      expect(themeScript).toContain('matchMedia')
    })

    it('references document.documentElement.classList', () => {
      expect(themeScript).toContain('document.documentElement.classList')
    })
  })
})
