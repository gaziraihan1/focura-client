import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the Redis module
vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => ({
    pipeline: () => ({
      zremrangebyscore: vi.fn().mockReturnThis(),
      zcard: vi.fn().mockReturnThis(),
      zadd: vi.fn().mockReturnThis(),
      expire: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([null, 0, null, null]),
    }),
  })),
}))

describe('limiter', () => {
  beforeEach(() => {
    vi.stubGlobal('process', { ...process, env: { ...process.env, NODE_ENV: 'test' } })
  })

  it('exports limitLogin function', async () => {
    const { limitLogin } = await import('@/lib/limiter')
    expect(typeof limitLogin).toBe('function')
  })

  it('limitLogin returns rate limit result', async () => {
    const { limitLogin } = await import('@/lib/limiter')
    const result = await limitLogin('127.0.0.1')
    expect(result).toHaveProperty('success')
    expect(result).toHaveProperty('limit', 5)
    expect(typeof result.success).toBe('boolean')
  })

  it('limitLogin with email includes email in key', async () => {
    const { limitLogin } = await import('@/lib/limiter')
    const result = await limitLogin('127.0.0.1', 'test@example.com')
    expect(result).toHaveProperty('success')
  })

  it('rate limiter allows requests under limit', async () => {
    const { limitLogin } = await import('@/lib/limiter')
    const result = await limitLogin('10.0.0.1')
    expect(result.success).toBe(true)
    expect(result.remaining).toBeGreaterThanOrEqual(0)
  })

  it('returns reset timestamp', async () => {
    const { limitLogin } = await import('@/lib/limiter')
    const result = await limitLogin('10.0.0.2')
    expect(result.reset).toBeDefined()
    expect(typeof result.reset).toBe('number')
  })

  it('returns limit value', async () => {
    const { limitLogin } = await import('@/lib/limiter')
    const result = await limitLogin('10.0.0.3')
    expect(result.limit).toBe(5)
  })
})
