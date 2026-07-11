import { describe, it, expect } from 'vitest'
import { sanitizeInput, sanitizeFilename, isValidUrl } from '@/lib/security/sanitize'

describe('sanitizeInput', () => {
  it('removes angle brackets', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
  })

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello')
  })

  it('truncates to 10000 chars', () => {
    const long = 'a'.repeat(15000)
    expect(sanitizeInput(long).length).toBe(10000)
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeInput(null as any)).toBe('')
    expect(sanitizeInput(undefined as any)).toBe('')
    expect(sanitizeInput(123 as any)).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(sanitizeInput('')).toBe('')
  })
})

describe('sanitizeFilename', () => {
  it('replaces special characters with underscores', () => {
    expect(sanitizeFilename('my file@name.txt')).toBe('my_file_name.txt')
  })

  it('removes path traversal', () => {
    // Three ../ sequences become three slashes, then three underscores
    expect(sanitizeFilename('../../../etc/passwd')).toBe('___etc_passwd')
  })

  it('truncates to 255 chars', () => {
    const long = 'a'.repeat(300) + '.txt'
    expect(sanitizeFilename(long).length).toBe(255)
  })

  it('returns "file" for invalid input', () => {
    expect(sanitizeFilename(null as any)).toBe('file')
    expect(sanitizeFilename(undefined as any)).toBe('file')
    expect(sanitizeFilename('')).toBe('file')
  })

  it('preserves allowed characters', () => {
    expect(sanitizeFilename('file-name_v2.0.txt')).toBe('file-name_v2.0.txt')
  })
})

describe('isValidUrl', () => {
  it('returns true for valid http URL', () => {
    expect(isValidUrl('http://example.com')).toBe(true)
  })

  it('returns true for valid https URL', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
  })

  it('returns false for ftp URL', () => {
    expect(isValidUrl('ftp://example.com')).toBe(false)
  })

  it('returns false for invalid URL', () => {
    expect(isValidUrl('not-a-url')).toBe(false)
  })

  it('returns false for javascript URL', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false)
  })
})
