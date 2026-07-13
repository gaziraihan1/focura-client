import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { limitLogin } from '@/lib/limiter'

describe('limiter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('limitLogin', () => {
    it('allows requests under the default limit (5)', async () => {
      const ip = '10.0.0.1'
      const email = 'user@example.com'

      for (let i = 0; i < 5; i++) {
        const result = await limitLogin(ip, email)
        expect(result.success).toBe(true)
        expect(result.remaining).toBeGreaterThanOrEqual(0)
      }
    })

    it('blocks requests over the default limit', async () => {
      const ip = '10.0.0.2'
      const email = 'limited@example.com'

      for (let i = 0; i < 5; i++) {
        await limitLogin(ip, email)
      }

      const blocked = await limitLogin(ip, email)
      expect(blocked.success).toBe(false)
      expect(blocked.remaining).toBe(0)
    })

    it('uses a different key when email is omitted', async () => {
      const ip = '10.0.0.3'

      const result = await limitLogin(ip)
      expect(result.success).toBe(true)
    })

    it('resets after window expires', async () => {
      const ip = '10.0.0.4'
      const email = 'expire@example.com'

      for (let i = 0; i < 5; i++) {
        await limitLogin(ip, email)
      }

      const blocked = await limitLogin(ip, email)
      expect(blocked.success).toBe(false)

      vi.advanceTimersByTime(61_000)

      const afterExpiry = await limitLogin(ip, email)
      expect(afterExpiry.success).toBe(true)
    })

    it('returns reset timestamp', async () => {
      const ip = '10.0.0.5'
      const result = await limitLogin(ip)

      expect(result.reset).toBeGreaterThan(0)
      expect(result.reset).toBeGreaterThanOrEqual(Date.now())
    })

    it('returns limit value', async () => {
      const ip = '10.0.0.6'
      const result = await limitLogin(ip)

      expect(result.limit).toBe(5)
    })

    it('decrements remaining on each request', async () => {
      const ip = '10.0.0.7'
      const email = 'count@example.com'

      const r1 = await limitLogin(ip, email)
      expect(r1.remaining).toBe(4)

      const r2 = await limitLogin(ip, email)
      expect(r2.remaining).toBe(3)

      const r3 = await limitLogin(ip, email)
      expect(r3.remaining).toBe(2)
    })

    it('returns remaining=0 when blocked', async () => {
      const ip = '10.0.0.8'
      const email = 'block@example.com'

      for (let i = 0; i < 5; i++) {
        await limitLogin(ip, email)
      }

      const blocked = await limitLogin(ip, email)
      expect(blocked.success).toBe(false)
      expect(blocked.remaining).toBe(0)
    })

    it('handles null email gracefully', async () => {
      const ip = '10.0.0.9'
      const result = await limitLogin(ip, null)

      expect(result.success).toBe(true)
    })

    it('handles undefined email gracefully', async () => {
      const ip = '10.0.0.10'
      const result = await limitLogin(ip, undefined)

      expect(result.success).toBe(true)
    })

    it('tracks different IPs independently', async () => {
      const email = 'shared@example.com'

      // Exhaust limit for IP 1
      for (let i = 0; i < 5; i++) {
        await limitLogin('10.0.0.11', email)
      }

      // IP 2 should still be allowed
      const result = await limitLogin('10.0.0.12', email)
      expect(result.success).toBe(true)
    })

    it('tracks different emails independently for same IP', async () => {
      const ip = '10.0.0.13'

      // Exhaust limit for email 1
      for (let i = 0; i < 5; i++) {
        await limitLogin(ip, 'email1@test.com')
      }

      // email 2 should still be allowed
      const result = await limitLogin(ip, 'email2@test.com')
      expect(result.success).toBe(true)
    })
  })
})
