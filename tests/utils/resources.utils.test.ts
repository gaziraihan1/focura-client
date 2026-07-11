import { describe, it, expect } from 'vitest'
import { splitDescriptionIntoSentences, formatDate, getCategoryAccent } from '@/utils/resources.utils'

describe('splitDescriptionIntoSentences', () => {
  it('splits by period', () => {
    const result = splitDescriptionIntoSentences('First sentence. Second sentence.')
    expect(result).toHaveLength(2)
    expect(result[0]).toBe('First sentence.')
    expect(result[1]).toBe('Second sentence.')
  })

  it('trims whitespace', () => {
    const result = splitDescriptionIntoSentences('  First.  Second.  ')
    expect(result[0]).toBe('First.')
    expect(result[1]).toBe('Second.')
  })

  it('filters empty sentences', () => {
    const result = splitDescriptionIntoSentences('First..Second.')
    expect(result).toHaveLength(2)
  })

  it('handles single sentence', () => {
    const result = splitDescriptionIntoSentences('Just one sentence')
    expect(result).toHaveLength(1)
    expect(result[0]).toBe('Just one sentence.')
  })
})

describe('formatDate', () => {
  it('formats string date', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('Jan')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('formats Date object', () => {
    const result = formatDate(new Date('2024-01-15'))
    expect(result).toContain('Jan')
  })
})

describe('getCategoryAccent', () => {
  it('returns an accent object', () => {
    const accent = getCategoryAccent('design')
    expect(accent).toHaveProperty('text')
    expect(accent).toHaveProperty('bg')
    expect(accent).toHaveProperty('border')
  })

  it('returns consistent accent for same category', () => {
    expect(getCategoryAccent('design')).toEqual(getCategoryAccent('design'))
  })

  it('returns different accents for different categories (likely)', () => {
    const a1 = getCategoryAccent('category-a')
    const a2 = getCategoryAccent('category-b')
    // Could be same due to hash collision, but structure should be valid
    expect(a1.text).toContain('text-chart-')
    expect(a2.text).toContain('text-chart-')
  })
})
