// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {},
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
  },
}))

vi.mock('next-auth/providers/credentials', () => ({
  default: (opts: Record<string, unknown>) => ({ id: opts.id, name: opts.name, type: 'credentials' }),
}))

vi.mock('next-auth/providers/google', () => ({
  default: (opts: Record<string, unknown>) => ({ id: 'google', name: 'Google', type: 'oauth' }),
}))

vi.mock('@next-auth/prisma-adapter', () => ({
  PrismaAdapter: () => ({}),
}))

vi.mock('argon2', () => ({
  verify: vi.fn().mockResolvedValue(true),
}))

describe('lib/auth/authOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('exports authOptions object', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    expect(authOptions).toBeDefined()
  })

  it('has jwt session strategy', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    expect(authOptions.session?.strategy).toBe('jwt')
  })

  it('has 7 day maxAge', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    expect(authOptions.session?.maxAge).toBe(7 * 24 * 60 * 60)
  })

  it('has 24 hour updateAge', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    expect(authOptions.session?.updateAge).toBe(24 * 60 * 60)
  })

  it('has 2 providers (credentials + google)', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    expect(authOptions.providers).toHaveLength(2)
  })

  it('has credentials provider', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    const creds = authOptions.providers.find((p: Record<string, unknown>) => p.id === 'credentials')
    expect(creds).toBeDefined()
  })

  it('has google provider', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    const google = authOptions.providers.find((p: Record<string, unknown>) => p.id === 'google')
    expect(google).toBeDefined()
  })

  it('has pages config', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    expect(authOptions.pages?.signIn).toBe('/authentication/login')
    expect(authOptions.pages?.error).toBe('/authentication/error')
  })

  it('has callbacks', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    expect(authOptions.callbacks).toBeDefined()
    expect(typeof authOptions.callbacks?.jwt).toBe('function')
    expect(typeof authOptions.callbacks?.session).toBe('function')
    expect(typeof authOptions.callbacks?.signIn).toBe('function')
  })

  it('has events', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    expect(authOptions.events).toBeDefined()
    expect(typeof authOptions.events?.linkAccount).toBe('function')
  })

  it('signIn denies Google linking when email is unverified and the account is password-based', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    const signInCb = authOptions.callbacks!.signIn as unknown as (params: {
      user: { email?: string }
      account?: { provider?: string }
      profile?: { email_verified?: boolean }
    }) => Promise<boolean | string>

    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'u1',
      email: 'victim@test.com',
      password: 'hashed-password',
      emailVerified: new Date(),
      name: 'Victim',
    } as any)

    const result = await signInCb({
      user: { email: 'victim@test.com' },
      account: { provider: 'google' },
      profile: { email_verified: false },
    })

    expect(result).toBe(false)
    expect(prisma.user.update).not.toHaveBeenCalled()
  })

  it('signIn allows Google linking when the email is verified', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    const signInCb = authOptions.callbacks!.signIn as unknown as (params: {
      user: { email?: string }
      account?: { provider?: string }
      profile?: { email_verified?: boolean }
    }) => Promise<boolean | string>

    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'u1',
      email: 'ok@test.com',
      password: 'hashed-password',
      emailVerified: new Date(),
      name: 'User',
    } as any)
    vi.mocked(prisma.user.update).mockResolvedValue({} as any)

    const result = await signInCb({
      user: { email: 'ok@test.com' },
      account: { provider: 'google' },
      profile: { email_verified: true },
    })

    expect(result).toBe(true)
    expect(prisma.user.update).toHaveBeenCalled()
  })

  it('signIn allows Google linking for a brand-new (non-existing) user even if unverified', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    const signInCb = authOptions.callbacks!.signIn as unknown as (params: {
      user: { email?: string }
      account?: { provider?: string }
      profile?: { email_verified?: boolean }
    }) => Promise<boolean | string>

    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const result = await signInCb({
      user: { email: 'new-user@test.com' },
      account: { provider: 'google' },
      profile: { email_verified: false },
    })

    expect(result).toBe(true)
  })

  it('jwt callback marks SESSION_EXPIRED instead of throwing when refresh token expired', async () => {
    // Simulate backend refresh endpoint being unreachable / returning failure
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    const { authOptions } = await import('@/lib/auth/authOptions')
    const jwtCb = authOptions.callbacks!.jwt as unknown as (params: {
      token: Record<string, unknown>
      user?: unknown
    }) => Promise<Record<string, unknown>>

    // Expired backend token + expired refresh token → previously threw
    // SESSION_EXPIRED, which made /api/auth/session return an HTML error page.
    const result = await jwtCb({
      token: {
        id: 'user-1',
        role: 'USER',
        sessionId: 'session-1',
        backendToken: 'old-token',
        backendTokenExpiry: Date.now() - 60_000,
        refreshToken: 'expired-refresh',
        refreshTokenExpiry: Date.now() - 60_000,
      },
      user: undefined,
    })

    // Must resolve (not throw) with an error flag and cleared credentials
    expect(result.error).toBe('SESSION_EXPIRED')
    expect(result.backendToken).toBe('')
    expect(result.backendTokenExpiry).toBe(0)
    expect(result.refreshToken).toBe('')
    expect(result.refreshTokenExpiry).toBe(0)
  })
})
