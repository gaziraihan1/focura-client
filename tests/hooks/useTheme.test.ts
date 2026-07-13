import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { toggleTheme, initTheme } from '@/hooks/useTheme'

describe('useTheme', () => {
  let mockClassList: { contains: ReturnType<typeof vi.fn>; add: ReturnType<typeof vi.fn>; remove: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockClassList = {
      contains: vi.fn(() => false),
      add: vi.fn(),
      remove: vi.fn(),
    }
    vi.spyOn(document.documentElement, 'classList', 'get').mockReturnValue(mockClassList as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('toggleTheme', () => {
    it('adds dark class when switching from light to dark', () => {
      mockClassList.contains.mockReturnValue(false)

      toggleTheme()

      expect(mockClassList.add).toHaveBeenCalledWith('dark')
    })

    it('removes dark class when switching from dark to light', () => {
      mockClassList.contains.mockReturnValue(true)

      toggleTheme()

      expect(mockClassList.remove).toHaveBeenCalledWith('dark')
    })
  })

  describe('initTheme', () => {
    it('adds dark class when localStorage theme is dark', () => {
      Object.defineProperty(localStorage, 'theme', {
        value: 'dark',
        writable: true,
        configurable: true,
      })

      initTheme()

      expect(mockClassList.add).toHaveBeenCalledWith('dark')
    })

    it('removes dark class when localStorage theme is light', () => {
      Object.defineProperty(localStorage, 'theme', {
        value: 'light',
        writable: true,
        configurable: true,
      })

      initTheme()

      expect(mockClassList.remove).toHaveBeenCalledWith('dark')
    })
  })
})
