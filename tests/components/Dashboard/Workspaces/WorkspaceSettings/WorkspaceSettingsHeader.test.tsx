import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

import { WorkspaceSettingsHeader } from '@/components/Dashboard/Workspaces/WorkspaceSettings/WorkspacesSettingsHeader'

describe('WorkspaceSettingsHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the heading', () => {
    render(<WorkspaceSettingsHeader />)
    expect(screen.getByText('Workspace Settings')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<WorkspaceSettingsHeader />)
    expect(screen.getByText('Manage your workspace preferences and team')).toBeInTheDocument()
  })

  it('heading has correct classes', () => {
    render(<WorkspaceSettingsHeader />)
    const heading = screen.getByText('Workspace Settings')
    expect(heading.tagName).toBe('H1')
    expect(heading.className).toContain('font-bold')
  })

  it('subtitle has muted text color', () => {
    render(<WorkspaceSettingsHeader />)
    const subtitle = screen.getByText('Manage your workspace preferences and team')
    expect(subtitle.tagName).toBe('P')
    expect(subtitle.className).toContain('text-muted-foreground')
  })
})
