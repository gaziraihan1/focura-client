import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/verify-email/route'

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    verificationToken: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      update: vi.fn(),
    },
  },
}))

describe('POST /api/auth/verify-email', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createRequest(body: any) {
    return new Request('http://localhost:3000/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  it('returns 400 for missing token', async () => {
    const req = createRequest({})
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Token is required')
  })

  it('returns 400 for invalid token', async () => {
    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.verificationToken.findUnique).mockResolvedValue(null)

    const req = createRequest({ token: 'invalid-token' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid or expired token')
  })

  it('returns 400 for expired token', async () => {
    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.verificationToken.findUnique).mockResolvedValue({
      token: 'expired-token',
      identifier: 'user@test.com',
      expires: new Date('2020-01-01'), // Already expired
    } as any)
    vi.mocked(prisma.verificationToken.delete).mockResolvedValue({} as any)

    const req = createRequest({ token: 'expired-token' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Token has expired')
    expect(prisma.verificationToken.delete).toHaveBeenCalled()
  })

  it('verifies email successfully', async () => {
    const { prisma } = await import('@/lib/prisma')
    const futureDate = new Date()
    futureDate.setHours(futureDate.getHours() + 24)

    vi.mocked(prisma.verificationToken.findUnique).mockResolvedValue({
      token: 'valid-token',
      identifier: 'user@test.com',
      expires: futureDate,
    } as any)
    vi.mocked(prisma.user.update).mockResolvedValue({} as any)
    vi.mocked(prisma.verificationToken.delete).mockResolvedValue({} as any)

    const req = createRequest({ token: 'valid-token' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Email verified successfully!')
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: 'user@test.com' },
      data: { emailVerified: expect.any(Date) },
    })
  })

  it('returns 500 on internal error', async () => {
    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.verificationToken.findUnique).mockRejectedValue(new Error('DB error'))

    const req = createRequest({ token: 'token' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to verify email')
  })
})
