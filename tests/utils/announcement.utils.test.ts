import { describe, it, expect } from 'vitest'
import { parseAnnouncement, tokensToHtml, stripTokens } from '@/utils/announcement.utils'

describe('parseAnnouncement', () => {
  it('parses plain text', () => {
    const tokens = parseAnnouncement('Hello world')
    expect(tokens).toHaveLength(1)
    expect(tokens[0]).toEqual({ type: 'text', value: 'Hello world' })
  })

  it('parses italic text', () => {
    const tokens = parseAnnouncement('//italic//')
    expect(tokens).toHaveLength(1)
    expect(tokens[0]).toEqual({ type: 'italic', value: 'italic' })
  })

  it('parses bold text', () => {
    const tokens = parseAnnouncement('**bold**')
    expect(tokens).toHaveLength(1)
    expect(tokens[0]).toEqual({ type: 'bold', value: 'bold' })
  })

  it('parses mono text', () => {
    const tokens = parseAnnouncement('$$code$$')
    expect(tokens).toHaveLength(1)
    expect(tokens[0]).toEqual({ type: 'mono', value: 'code' })
  })

  it('parses link with label', () => {
    const tokens = parseAnnouncement('{https://example.com|Click here}')
    expect(tokens).toHaveLength(1)
    expect(tokens[0]).toEqual({ type: 'link', url: 'https://example.com', label: 'Click here' })
  })

  it('parses link without label', () => {
    const tokens = parseAnnouncement('{https://example.com}')
    expect(tokens).toHaveLength(1)
    expect(tokens[0]).toEqual({ type: 'link', url: 'https://example.com', label: 'https://example.com' })
  })

  it('parses break', () => {
    const tokens = parseAnnouncement('>')
    expect(tokens).toHaveLength(1)
    expect(tokens[0]).toEqual({ type: 'break' })
  })

  it('parses mixed content', () => {
    const tokens = parseAnnouncement('Hello //world// **bold** >test')
    expect(tokens.length).toBeGreaterThan(1)
  })

  it('handles text after last token', () => {
    const tokens = parseAnnouncement('**bold** and more')
    expect(tokens).toHaveLength(2)
    expect(tokens[1]).toEqual({ type: 'text', value: ' and more' })
  })
})

describe('tokensToHtml', () => {
  it('converts text tokens', () => {
    expect(tokensToHtml([{ type: 'text', value: 'hello' }])).toBe('hello')
  })

  it('converts italic tokens', () => {
    expect(tokensToHtml([{ type: 'italic', value: 'text' }])).toBe('<em>text</em>')
  })

  it('converts bold tokens', () => {
    expect(tokensToHtml([{ type: 'bold', value: 'text' }])).toBe('<strong>text</strong>')
  })

  it('converts mono tokens', () => {
    const html = tokensToHtml([{ type: 'mono', value: 'code' }])
    expect(html).toContain('<code')
    expect(html).toContain('code')
  })

  it('converts link tokens', () => {
    const html = tokensToHtml([{ type: 'link', url: 'https://example.com', label: 'Click' }])
    expect(html).toContain('href=')
    expect(html).toContain('target="_blank"')
  })

  it('converts break tokens', () => {
    expect(tokensToHtml([{ type: 'break' }])).toBe('<br/>')
  })

  it('escapes HTML in text', () => {
    expect(tokensToHtml([{ type: 'text', value: '<script>' }])).toBe('&lt;script&gt;')
  })
})

describe('stripTokens', () => {
  it('strips italic markers', () => {
    expect(stripTokens('//italic//')).toBe('italic')
  })

  it('strips bold markers', () => {
    expect(stripTokens('**bold**')).toBe('bold')
  })

  it('strips mono markers', () => {
    expect(stripTokens('$$code$$')).toBe('code')
  })

  it('strips link syntax to label', () => {
    expect(stripTokens('{https://example.com|Click}')).toBe('Click')
  })

  it('strips link syntax to url when no label', () => {
    expect(stripTokens('{https://example.com}')).toBe('https://example.com')
  })

  it('replaces > with space', () => {
    expect(stripTokens('>')).toBe(' ')
  })
})
