import { describe, it, expect, vi } from 'vitest'
import { useNotificationsPage } from '@/hooks/useNotificationsPage'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

// Mock EventSource for jsdom
class MockEventSource {
  static instances: MockEventSource[] = []
  url: string
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  close = vi.fn()

  constructor(url: string) {
    this.url = url
    MockEventSource.instances.push(this)
  }
}

vi.stubGlobal('EventSource', MockEventSource)

describe('useNotificationsPage', () => {
  it('can be imported', () => {
    expect(typeof useNotificationsPage).toBe('function')
  })
})
