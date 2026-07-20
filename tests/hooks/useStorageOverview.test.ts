import { describe, it, expect, vi } from 'vitest'
import { useStorageOverview } from '@/hooks/useStorageOverview'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useStorageOverview', () => {
  it('can be imported', () => {
    expect(typeof useStorageOverview).toBe('function')
  })
})
