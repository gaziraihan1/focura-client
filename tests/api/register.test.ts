import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/register/route'

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    verificationToken: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/email', () => ({
  sendVerificationEmail: vi.fn(),
  EmailError: class EmailError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'EmailError'
    }
  },
}))

vi.mock('@/lib/limiter', () => ({
  limitLogin: vi.fn().mockResolvedValue({ success: true }),
}))

vi.mock('argon2', () => ({
  hash: vi.fn().mockResolvedValue('hashed-password'),
}))

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createRequest(body: any) {
    return new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  it('returns 400 for invalid request body', async () => {
    const req = createRequest({ name: 'Test' }) // missing email and password
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid request body')
  })

  it('returns 400 for missing name', async () => {
    const req = createRequest({ email: 'test@test.com', password: 'password123' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid request body')
  })

  it('returns 400 for short name', async () => {
    const req = createRequest({ name: 'Ab', email: 'test@test.com', password: 'password123' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Name must be at least 4 characters')
  })

  it('returns 400 for invalid email', async () => {
    const req = createRequest({ name: 'Test User', email: 'invalid-email', password: 'password123' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid email format')
  })

  it('returns 400 for short password', async () => {
    const req = createRequest({ name: 'Test User', email: 'test@test.com', password: '12345' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Password must be at least 6 characters')
  })

  it('returns 400 for existing user', async () => {
    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'existing-user' } as any)

    const req = createRequest({ name: 'Test User', email: 'existing@test.com', password: 'password123' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('User already exists')
  })

  it('creates user and returns 201 on success', async () => {
    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: 'new-user',
      name: 'Test User',
      email: 'test@test.com',
    } as any)
    vi.mocked(prisma.verificationToken.create).mockResolvedValue({} as any)

    const { sendVerificationEmail } = await import('@/lib/email')
    vi.mocked(sendVerificationEmail).mockResolvedValue(undefined)

    const req = createRequest({ name: 'Test User', email: 'test@test.com', password: 'password123' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.message).toContain('Registration successful')
    expect(data.user.email).toBe('test@test.com')
  })

  it('returns 429 when rate limited', async () => {
    const { limitLogin } = await import('@/lib/limiter')
    vi.mocked(limitLogin).mockResolvedValue({ success: false })

    const req = createRequest({ name: 'Test User', email: 'test@test.com', password: 'password123' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.error).toContain('Too many attempts')
  })

  it('rolls back user on email failure', async () => {
    const { prisma } = await import('@/lib/prisma')
    const { limitLogin } = await import('@/lib/limiter')
    vi.mocked(limitLogin).mockResolvedValue({ success: true })
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: 'new-user',
      name: 'Test User',
      email: 'test@test.com',
    } as any)
    vi.mocked(prisma.verificationToken.create).mockResolvedValue({} as any)

    const { sendVerificationEmail, EmailError } = await import('@/lib/email')
    vi.mocked(sendVerificationEmail).mockRejectedValue(new EmailError('SMTP error'))

    const req = createRequest({ name: 'Test User', email: 'test@test.com', password: 'password123' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toContain('Failed to send verification email')
    expect(prisma.user.delete).toHaveBeenCalled()
    expect(prisma.verificationToken.deleteMany).toHaveBeenCalled()
  })
})
