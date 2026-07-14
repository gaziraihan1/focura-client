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
  default: (opts: any) => ({ id: opts.id, name: opts.name, type: 'credentials' }),
}))

vi.mock('next-auth/providers/google', () => ({
  default: (opts: any) => ({ id: 'google', name: 'Google', type: 'oauth' }),
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
    const creds = authOptions.providers.find((p: any) => p.id === 'credentials')
    expect(creds).toBeDefined()
  })

  it('has google provider', async () => {
    const { authOptions } = await import('@/lib/auth/authOptions')
    const google = authOptions.providers.find((p: any) => p.id === 'google')
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
})
