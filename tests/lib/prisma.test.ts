import { describe, it, expect, vi } from 'vitest'

vi.mock('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {},
}))

describe('lib/prisma', () => {
  it('exports prisma instance', async () => {
    const { prisma } = await import('@/lib/prisma')
    expect(prisma).toBeDefined()
  })

  it('returns the same instance on repeated imports', async () => {
    const mod1 = await import('@/lib/prisma')
    const mod2 = await import('@/lib/prisma')
    expect(mod1.prisma).toBe(mod2.prisma)
  })
})
