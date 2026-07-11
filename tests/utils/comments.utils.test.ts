import { describe, it, expect } from 'vitest'
import {
  buildCommentTree,
  getRelativeTimeLabel,
  parseMentions,
  stripMentionSyntax,
  detectMentionQuery,
} from '@/utils/comments.utils'
import type { TaskComment } from '@/types/task.types'

describe('buildCommentTree', () => {
  it('builds flat tree for root comments', () => {
    const comments: TaskComment[] = [
      { id: '1', content: 'c1', createdAt: '', user: { id: 'u1', name: 'User' }, parentId: null, edited: false },
      { id: '2', content: 'c2', createdAt: '', user: { id: 'u1', name: 'User' }, parentId: null, edited: false },
    ]
    const tree = buildCommentTree(comments)
    expect(tree).toHaveLength(2)
    expect(tree[0].replies).toHaveLength(0)
  })

  it('nests replies under parent', () => {
    const comments: TaskComment[] = [
      { id: '1', content: 'parent', createdAt: '', user: { id: 'u1', name: 'User' }, parentId: null, edited: false },
      { id: '2', content: 'reply', createdAt: '', user: { id: 'u1', name: 'User' }, parentId: '1', edited: false },
    ]
    const tree = buildCommentTree(comments)
    expect(tree).toHaveLength(1)
    expect(tree[0].replies).toHaveLength(1)
    expect(tree[0].replies[0].id).toBe('2')
  })

  it('handles orphan comments as roots', () => {
    const comments: TaskComment[] = [
      { id: '1', content: 'orphan', createdAt: '', user: { id: 'u1', name: 'User' }, parentId: 'nonexistent', edited: false },
    ]
    const tree = buildCommentTree(comments)
    expect(tree).toHaveLength(1)
  })

  it('handles empty array', () => {
    expect(buildCommentTree([])).toHaveLength(0)
  })
})

describe('getRelativeTimeLabel', () => {
  it('returns just now for recent', () => {
    const now = new Date().toISOString()
    expect(getRelativeTimeLabel(now)).toBe('just now')
  })

  it('returns minutes ago', () => {
    const d = new Date(Date.now() - 5 * 60 * 1000)
    expect(getRelativeTimeLabel(d.toISOString())).toBe('5m ago')
  })

  it('returns hours ago', () => {
    const d = new Date(Date.now() - 3 * 3600 * 1000)
    expect(getRelativeTimeLabel(d.toISOString())).toBe('3h ago')
  })

  it('returns days ago', () => {
    const d = new Date(Date.now() - 3 * 86400 * 1000)
    expect(getRelativeTimeLabel(d.toISOString())).toBe('3d ago')
  })

  it('returns formatted date for old dates', () => {
    // Use a date from more than 7 days ago (604800 seconds)
    const d = new Date(Date.now() - 10 * 86400 * 1000)
    const result = getRelativeTimeLabel(d.toISOString())
    // Should be formatted as "Jul 1" or similar (month + day)
    expect(result).toMatch(/[A-Za-z]{3} \d{1,2}/)
  })
})

describe('parseMentions', () => {
  it('parses mentions', () => {
    const parts = parseMentions('Hello @[John](id-1)!')
    expect(parts).toHaveLength(3)
    expect(parts[0]).toEqual({ type: 'text', value: 'Hello ' })
    expect(parts[1]).toEqual({ type: 'mention', value: 'John' })
    expect(parts[2]).toEqual({ type: 'text', value: '!' })
  })

  it('returns text only when no mentions', () => {
    const parts = parseMentions('Hello world')
    expect(parts).toHaveLength(1)
    expect(parts[0]).toEqual({ type: 'text', value: 'Hello world' })
  })

  it('handles multiple mentions', () => {
    const parts = parseMentions('@[A](1) and @[B](2)')
    expect(parts).toHaveLength(3)
    expect(parts.filter(p => p.type === 'mention')).toHaveLength(2)
  })
})

describe('stripMentionSyntax', () => {
  it('replaces mention syntax with @name', () => {
    expect(stripMentionSyntax('Hello @[John](id-1)!')).toBe('Hello @John!')
  })

  it('leaves plain text unchanged', () => {
    expect(stripMentionSyntax('Hello world')).toBe('Hello world')
  })
})

describe('detectMentionQuery', () => {
  it('detects mention query', () => {
    const result = detectMentionQuery('Hello @jo', 9)
    expect(result).not.toBeNull()
    expect(result!.query).toBe('jo')
  })

  it('returns null when no @ prefix', () => {
    expect(detectMentionQuery('Hello world', 5)).toBeNull()
  })

  it('detects empty query after @', () => {
    const result = detectMentionQuery('Hello @', 7)
    expect(result).not.toBeNull()
    expect(result!.query).toBe('')
  })
})
