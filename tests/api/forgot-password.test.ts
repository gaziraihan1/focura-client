import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/forgot-password/route'

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    passwordResetToken: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('@/lib/email', () => ({
  sendPasswordResetEmail: vi.fn(),
}))

describe('POST /api/auth/forgot-password', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createRequest(body: Record<string, unknown>) {
    return new Request('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  it('returns 400 for missing email', async () => {
    const req = createRequest({})
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email is required')
  })

  it('returns success message even for non-existent user', async () => {
    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const req = createRequest({ email: 'nonexistent@test.com' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toContain('password reset email')
  })

  it('sends reset email for existing user', async () => {
    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'user@test.com',
    } as any as Record<string, unknown>)
    vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({} as any as Record<string, unknown>)
    vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({} as any as Record<string, unknown>)

    const { sendPasswordResetEmail } = await import('@/lib/email')
    vi.mocked(sendPasswordResetEmail).mockResolvedValue(undefined)

    const req = createRequest({ email: 'user@test.com' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(sendPasswordResetEmail).toHaveBeenCalled()
  })

  it('returns 500 on internal error', async () => {
    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('DB error'))

    const req = createRequest({ email: 'user@test.com' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to process request')
  })
})
