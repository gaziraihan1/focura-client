import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDevSectionContent } from '@/components/DevGuides/UseDevSectionContent'

vi.mock('@/components/DevGuides', () => ({
  OverviewSection: () => null,
  SetupSection: () => null,
  FrontendArchSection: () => null,
  BackendArchSection: () => null,
  AuthSection: () => null,
  ApiLayerSection: () => null,
  DatabaseSection: () => null,
  CachingSection: () => null,
  RealtimeSection: () => null,
  AddingFeatureSection: () => null,
  TestingSection: () => null,
  EnvVarsSection: () => null,
  ConventionsSection: () => null,
}))

const SECTION_IDS = [
  'overview',
  'setup',
  'frontend-arch',
  'backend-arch',
  'auth',
  'api-layer',
  'database',
  'caching',
  'realtime',
  'adding-feature',
  'testing',
  'env-vars',
  'conventions',
] as const

describe('useDevSectionContent', () => {
  it('returns null for an unknown section id', () => {
    const { result } = renderHook(() => useDevSectionContent('nonexistent'))
    expect(result.current).toBeNull()
  })

  it('returns null for an empty string', () => {
    const { result } = renderHook(() => useDevSectionContent(''))
    expect(result.current).toBeNull()
  })

  it.each(SECTION_IDS)('returns a ReactNode for section "%s"', (id) => {
    const { result } = renderHook(() => useDevSectionContent(id))
    expect(result.current).not.toBeNull()
  })

  it('returns the same reference for the same id across calls', () => {
    const { result: r1 } = renderHook(() => useDevSectionContent('overview'))
    const { result: r2 } = renderHook(() => useDevSectionContent('overview'))
    expect(r1.current).toBe(r2.current)
  })

  it('returns different references for different ids', () => {
    const { result: r1 } = renderHook(() => useDevSectionContent('overview'))
    const { result: r2 } = renderHook(() => useDevSectionContent('setup'))
    expect(r1.current).not.toBe(r2.current)
  })
})
