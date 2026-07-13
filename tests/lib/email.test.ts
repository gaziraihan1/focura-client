import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock nodemailer
const mockSendMail = vi.fn()
const mockVerify = vi.fn()
vi.mock('nodemailer', () => ({
  default: {
    createTransport: () => ({
      sendMail: mockSendMail,
      verify: mockVerify,
    }),
  },
}))

describe('lib/email', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.EMAIL_SERVER_HOST = 'smtp.test.com'
    process.env.EMAIL_SERVER_PORT = '587'
    process.env.EMAIL_SERVER_USER = 'test@test.com'
    process.env.EMAIL_SERVER_PASSWORD = 'password'
    process.env.EMAIL_FROM = 'noreply@focura.com'
    process.env.NEXTAUTH_URL = 'https://focura.com'
  })

  it('EmailError has correct name and message', async () => {
    const { EmailError } = await import('@/lib/email')
    const error = new EmailError('test error')

    expect(error.name).toBe('EmailError')
    expect(error.message).toBe('test error')
  })

  it('EmailError preserves cause', async () => {
    const { EmailError } = await import('@/lib/email')
    const cause = new Error('original')
    const error = new EmailError('test', cause)

    expect(error.cause).toBe(cause)
  })

  it('verifyEmailConnection calls transporter.verify', async () => {
    mockVerify.mockResolvedValue(true)
    const { verifyEmailConnection } = await import('@/lib/email')

    await verifyEmailConnection()
    expect(mockVerify).toHaveBeenCalled()
  })

  it('verifyEmailConnection throws EmailError on failure', async () => {
    mockVerify.mockRejectedValue(new Error('Connection refused'))
    const { verifyEmailConnection, EmailError } = await import('@/lib/email')

    await expect(verifyEmailConnection()).rejects.toThrow(EmailError)
  })

  it('sendVerificationEmail sends email with correct subject', async () => {
    mockSendMail.mockResolvedValue({ messageId: '123' })
    const { sendVerificationEmail } = await import('@/lib/email')

    await sendVerificationEmail('user@test.com', 'token-123')

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@test.com',
        subject: expect.stringContaining('Verify your email'),
      })
    )
  })

  it('sendPasswordResetEmail sends email with correct subject', async () => {
    mockSendMail.mockResolvedValue({ messageId: '456' })
    const { sendPasswordResetEmail } = await import('@/lib/email')

    await sendPasswordResetEmail('user@test.com', 'reset-token')

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@test.com',
        subject: expect.stringContaining('Reset your password'),
      })
    )
  })

  it('sendVerificationEmail includes verification URL in HTML', async () => {
    mockSendMail.mockResolvedValue({ messageId: '123' })
    const { sendVerificationEmail } = await import('@/lib/email')

    await sendVerificationEmail('user@test.com', 'token-abc')

    const html = mockSendMail.mock.calls[0][0].html
    expect(html).toContain('token-abc')
    expect(html).toContain('verify-email')
  })

  it('sendPasswordResetEmail includes reset URL in HTML', async () => {
    mockSendMail.mockResolvedValue({ messageId: '456' })
    const { sendPasswordResetEmail } = await import('@/lib/email')

    await sendPasswordResetEmail('user@test.com', 'reset-xyz')

    const html = mockSendMail.mock.calls[0][0].html
    expect(html).toContain('reset-xyz')
    expect(html).toContain('reset-password')
  })

  it('throws when EMAIL_FROM is missing', async () => {
    delete process.env.EMAIL_FROM
    mockSendMail.mockResolvedValue({ messageId: '123' })
    const { sendVerificationEmail, EmailError } = await import('@/lib/email')

    await expect(sendVerificationEmail('user@test.com', 'token')).rejects.toThrow(EmailError)
  })

  it('throws when NEXTAUTH_URL is missing', async () => {
    delete process.env.NEXTAUTH_URL
    const { sendVerificationEmail, EmailError } = await import('@/lib/email')

    await expect(sendVerificationEmail('user@test.com', 'token')).rejects.toThrow(EmailError)
  })
})
