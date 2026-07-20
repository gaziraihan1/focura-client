import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useHelpTopics, useHelpSearch } from '@/hooks/useHelpTopics'

describe('useHelpTopics', () => {
  it('returns all topics', () => {
    const { result } = renderHook(() => useHelpTopics())

    expect(result.current.topics).toHaveLength(4)
    expect(result.current.topics.map((t) => t.id)).toEqual([
      'getting-started',
      'workspace',
      'tasks',
      'contact',
    ])
  })

  it('finds topic by id', () => {
    const { result } = renderHook(() => useHelpTopics())

    const topic = result.current.getTopicById('tasks')
    expect(topic).not.toBeNull()
    expect(topic?.label).toBe('Tasks')
    expect(topic?.articles).toHaveLength(3)
  })

  it('returns null for unknown id', () => {
    const { result } = renderHook(() => useHelpTopics())

    expect(result.current.getTopicById('nonexistent')).toBeNull()
  })

  it('has articles with required fields', () => {
    const { result } = renderHook(() => useHelpTopics())

    const gsTopic = result.current.getTopicById('getting-started')
    expect(gsTopic?.articles[0]).toHaveProperty('id')
    expect(gsTopic?.articles[0]).toHaveProperty('title')
    expect(gsTopic?.articles[0]).toHaveProperty('description')
    expect(gsTopic?.articles[0]).toHaveProperty('keywords')
  })
})

describe('useHelpSearch', () => {
  it('returns empty results for empty query', () => {
    const { result } = renderHook(() => useHelpSearch())

    expect(result.current.results).toEqual([])
    expect(result.current.hasResults).toBe(false)
    expect(result.current.isEmpty).toBe(false)
  })

  it('searches by title keyword', () => {
    const { result } = renderHook(() => useHelpSearch())

    act(() => result.current.setQuery('workspace'))

    expect(result.current.results.length).toBeGreaterThan(0)
    expect(result.current.hasResults).toBe(true)
    expect(result.current.isEmpty).toBe(false)
  })

  it('searches by article keyword', () => {
    const { result } = renderHook(() => useHelpSearch())

    act(() => result.current.setQuery('role'))

    expect(result.current.results.length).toBeGreaterThan(0)
    // Should find the roles & permissions article
    const ids = result.current.results.map((r) => r.id)
    expect(ids).toContain('ws-1')
  })

  it('returns empty for no matches', () => {
    const { result } = renderHook(() => useHelpSearch())

    act(() => result.current.setQuery('xyznonexistent'))

    expect(result.current.results).toHaveLength(0)
    expect(result.current.hasResults).toBe(false)
    expect(result.current.isEmpty).toBe(true)
  })

  it('ranks results by relevance', () => {
    const { result } = renderHook(() => useHelpSearch())

    act(() => result.current.setQuery('task'))

    // Title matches should score higher than keyword-only matches
    expect(result.current.results.length).toBeGreaterThan(0)
    expect(result.current.results[0].type).toBe('article')
  })

  it('clears the query', () => {
    const { result } = renderHook(() => useHelpSearch())

    act(() => result.current.setQuery('workspace'))
    expect(result.current.query).toBe('workspace')

    act(() => result.current.clear())
    expect(result.current.query).toBe('')
    expect(result.current.results).toEqual([])
  })

  it('is case insensitive', () => {
    const { result } = renderHook(() => useHelpSearch())

    act(() => result.current.setQuery('WORKSPACE'))

    expect(result.current.results.length).toBeGreaterThan(0)
  })
})

// Need to import act for the search tests
import { act } from '@testing-library/react'
