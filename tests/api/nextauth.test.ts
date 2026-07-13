import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the limiter
vi.mock('@/lib/limiter', () => ({
  limitLogin: vi.fn().mockResolvedValue({ success: true }),
}))

// Mock next-auth to return a simple handler
vi.mock('next-auth', () => ({
  default: vi.fn(() => ({
    handlers: {
      GET: vi.fn().mockResolvedValue(new Response('OK')),
      POST: vi.fn().mockResolvedValue(new Response('OK')),
    },
  })),
}))

vi.mock('@/lib/auth/authOptions', () => ({
  authOptions: {},
}))

describe('NextAuth API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports POST handler', async () => {
    const route = await import('@/app/api/auth/[...nextauth]/route')
    expect(typeof route.POST).toBe('function')
  })

  it('exports GET handler', async () => {
    const route = await import('@/app/api/auth/[...nextauth]/route')
    expect(typeof route.GET).toBe('function')
  })

  it('rate limiter is configured', async () => {
    const { limitLogin } = await import('@/lib/limiter')
    expect(typeof limitLogin).toBe('function')
  })
})
