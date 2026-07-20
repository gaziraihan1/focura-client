import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/reset-password/route'

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    passwordResetToken: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      update: vi.fn(),
    },
  },
}))

vi.mock('argon2', () => ({
  hash: vi.fn().mockResolvedValue('hashed-password'),
}))

describe('POST /api/auth/reset-password', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createRequest(body: Record<string, unknown>) {
    return new Request('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  it('returns 400 for missing token', async () => {
    const req = createRequest({ password: 'password123' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Token and password are required')
  })

  it('returns 400 for missing password', async () => {
    const req = createRequest({ token: 'token' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Token and password are required')
  })

  it('returns 400 for short password', async () => {
    const req = createRequest({ token: 'token', password: '12345' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Password must be at least 6 characters')
  })

  it('returns 400 for invalid token', async () => {
    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(null)

    const req = createRequest({ token: 'invalid-token', password: 'password123' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid or expired token')
  })

  it('returns 400 for expired token', async () => {
    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({
      token: 'expired-token',
      email: 'user@test.com',
      expires: new Date('2020-01-01'), // Already expired
    } as any as Record<string, unknown>)
    vi.mocked(prisma.passwordResetToken.delete).mockResolvedValue({} as any as Record<string, unknown>)

    const req = createRequest({ token: 'expired-token', password: 'password123' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Token has expired')
    expect(prisma.passwordResetToken.delete).toHaveBeenCalled()
  })

  it('resets password successfully', async () => {
    const { prisma } = await import('@/lib/prisma')
    const futureDate = new Date()
    futureDate.setHours(futureDate.getHours() + 1)

    vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({
      token: 'valid-token',
      email: 'user@test.com',
      expires: futureDate,
    } as any as Record<string, unknown>)
    vi.mocked(prisma.user.update).mockResolvedValue({} as any as Record<string, unknown>)
    vi.mocked(prisma.passwordResetToken.delete).mockResolvedValue({} as any as Record<string, unknown>)

    const { hash } = await import('argon2')
    vi.mocked(hash).mockResolvedValue('hashed-password')

    const req = createRequest({ token: 'valid-token', password: 'newpassword123' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Password reset successfully!')
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: 'user@test.com' },
      data: { password: 'hashed-password' },
    })
    expect(prisma.passwordResetToken.delete).toHaveBeenCalled()
  })

  it('returns 500 on internal error', async () => {
    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.passwordResetToken.findUnique).mockRejectedValue(new Error('DB error'))

    const req = createRequest({ token: 'token', password: 'password123' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to reset password')
  })
})
