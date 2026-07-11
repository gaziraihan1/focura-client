import { describe, it, expect } from 'vitest'
import { generateRawToken, hashToken } from '@/lib/tokens'

describe('generateRawToken', () => {
  it('generates hex string of default length', () => {
    const token = generateRawToken()
    expect(token).toMatch(/^[a-f0-9]+$/)
    expect(token.length).toBe(96) // 48 bytes = 96 hex chars
  })

  it('generates token of custom size', () => {
    const token = generateRawToken(32)
    expect(token.length).toBe(64) // 32 bytes = 64 hex chars
  })

  it('generates unique tokens', () => {
    const t1 = generateRawToken()
    const t2 = generateRawToken()
    expect(t1).not.toBe(t2)
  })
})

describe('hashToken', () => {
  it('returns sha256 hex hash', () => {
    const hash = hashToken('test-token')
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  it('returns consistent hash for same input', () => {
    expect(hashToken('same')).toBe(hashToken('same'))
  })

  it('returns different hash for different input', () => {
    expect(hashToken('a')).not.toBe(hashToken('b'))
  })
})
