import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock argon2
vi.mock('argon2', () => ({
  default: {
    hash: vi.fn(async (password: string) => `$argon2id$v=19$m=65536$t=3$p=4$${password}`),
    verify: vi.fn(async (hash: string, password: string) => hash.includes(password)),
  },
}))

describe('lib/hash', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hashes a password', async () => {
    const { hashPassword } = await import('@/lib/hash')
    const hash = await hashPassword('mypassword')

    expect(hash).toContain('argon2')
  })

  it('verifies a correct password', async () => {
    const { hashPassword, verifyPassword } = await import('@/lib/hash')
    const hash = await hashPassword('correct')

    const result = await verifyPassword(hash, 'correct')
    expect(result).toBe(true)
  })

  it('rejects an incorrect password', async () => {
    const { hashPassword, verifyPassword } = await import('@/lib/hash')
    const hash = await hashPassword('correct')

    const result = await verifyPassword(hash, 'wrong')
    expect(result).toBe(false)
  })
})
