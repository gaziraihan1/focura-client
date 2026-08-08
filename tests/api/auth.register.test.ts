import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn(), create: vi.fn() },
    verificationToken: { create: vi.fn(), deleteMany: vi.fn() },
  },
}))

vi.mock('@/lib/email', () => ({
  EmailError: class EmailError extends Error {},
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/limiter', () => ({
  limitLogin: vi.fn().mockResolvedValue({ success: true }),
}))

vi.mock('argon2', () => ({
  hash: vi.fn().mockResolvedValue('hashed-password'),
}))

vi.mock('@prisma/client', () => ({
  Prisma: { PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {} },
}))

import { POST } from '@/app/api/auth/register/route'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'

function registerRequest(password: string) {
  return new NextRequest('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password }),
  })
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects a 7-character password (policy is 8+)', async () => {
    const res = await POST(registerRequest('1234567'))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('8 characters')
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('accepts an 8-character password and sends the verification email', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: 'u1',
      name: 'Test User',
      email: 'test@example.com',
    } as any)
    vi.mocked(prisma.verificationToken.create).mockResolvedValue({} as any)

    const res = await POST(registerRequest('12345678'))
    expect(res.status).toBe(201)
    expect(sendVerificationEmail).toHaveBeenCalled()
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ lastPasswordChange: expect.any(Date) }),
      }),
    )
  })
})
