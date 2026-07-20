import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useWorkspaceSettings, PREDEFINED_COLORS } from '@/hooks/useWorkspaceSettings'

vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: { id: 'user-1' },
      backendToken: 'token',
    },
  }),
}))

describe('useWorkspaceSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports PREDEFINED_COLORS', () => {
    expect(PREDEFINED_COLORS).toHaveLength(8)
    expect(PREDEFINED_COLORS[0]).toBe('#667eea')
  })

  it('can be imported', () => {
    expect(typeof useWorkspaceSettings).toBe('function')
  })
})
