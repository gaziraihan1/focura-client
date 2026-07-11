import { describe, it, expect } from 'vitest'
import { slugify, getWorkspaceSlug, getProjectRoute } from '@/utils/slugify'

describe('slugify', () => {
  it('converts text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('trims whitespace', () => {
    expect(slugify('  hello world  ')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world')
  })

  it('replaces multiple spaces with single dash', () => {
    expect(slugify('hello   world')).toBe('hello-world')
  })

  it('replaces multiple dashes with single dash', () => {
    expect(slugify('hello---world')).toBe('hello-world')
  })

  it('removes leading dashes', () => {
    expect(slugify('-hello-world')).toBe('hello-world')
  })

  it('removes trailing dashes', () => {
    expect(slugify('hello-world-')).toBe('hello-world')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('handles string with only special characters', () => {
    expect(slugify('!@#$%^&*()')).toBe('')
  })
})

describe('getWorkspaceSlug', () => {
  it('returns existing slug if provided', () => {
    const workspace = { id: 'ws-1', name: 'My Workspace', slug: 'my-slug' }
    expect(getWorkspaceSlug(workspace)).toBe('my-slug')
  })

  it('generates slug from name if no slug provided', () => {
    const workspace = { id: 'ws-1', name: 'My Workspace' }
    expect(getWorkspaceSlug(workspace)).toBe('my-workspace')
  })

  it('falls back to id if generated slug is empty', () => {
    const workspace = { id: 'ws-1', name: '!@#$' }
    expect(getWorkspaceSlug(workspace)).toBe('ws-1')
  })
})

describe('getProjectRoute', () => {
  it('uses workspaceSlug when provided', () => {
    const route = getProjectRoute('ws-1', 'My Workspace', 'proj-1', 'my-slug')
    expect(route).toBe('/dashboard/workspaces/my-slug/projects/proj-1')
  })

  it('generates slug from workspaceName when no slug provided', () => {
    const route = getProjectRoute('ws-1', 'My Workspace', 'proj-1')
    expect(route).toBe('/dashboard/workspaces/my-workspace/projects/proj-1')
  })

  it('falls back to workspaceId if name produces empty slug', () => {
    const route = getProjectRoute('ws-1', '!@#', 'proj-1')
    expect(route).toBe('/dashboard/workspaces/ws-1/projects/proj-1')
  })
})
