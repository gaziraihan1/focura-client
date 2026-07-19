import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { WorkspaceSettingsTabs } from '@/components/Dashboard/Workspaces/WorkspaceSettings/WorkspacesSettingsTabs'

describe('WorkspacesSettingsTabs', () => {
  const defaultProps = {
    activeTab: 'general' as const,
    onTabChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all three tabs', () => {
    render(<WorkspaceSettingsTabs {...defaultProps} />)
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('Members')).toBeInTheDocument()
    expect(screen.getByText('Danger Zone')).toBeInTheDocument()
  })

  it('calls onTabChange when General tab is clicked', () => {
    render(<WorkspaceSettingsTabs {...defaultProps} />)
    fireEvent.click(screen.getByText('General'))
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('general')
  })

  it('calls onTabChange when Members tab is clicked', () => {
    render(<WorkspaceSettingsTabs {...defaultProps} />)
    fireEvent.click(screen.getByText('Members'))
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('members')
  })

  it('calls onTabChange when Danger Zone tab is clicked', () => {
    render(<WorkspaceSettingsTabs {...defaultProps} />)
    fireEvent.click(screen.getByText('Danger Zone'))
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('danger')
  })

  it('applies active styles to the active tab (general)', () => {
    const { container } = render(<WorkspaceSettingsTabs activeTab="general" onTabChange={vi.fn()} />)
    const generalBtn = screen.getByText('General').closest('button')!
    expect(generalBtn.className).toContain('border-primary')
    expect(generalBtn.className).toContain('text-primary')
  })

  it('applies inactive styles to non-active tabs', () => {
    render(<WorkspaceSettingsTabs activeTab="members" onTabChange={vi.fn()} />)
    const generalBtn = screen.getByText('General').closest('button')!
    const membersBtn = screen.getByText('Members').closest('button')!
    expect(generalBtn.className).toContain('border-transparent')
    expect(generalBtn.className).toContain('text-muted-foreground')
    expect(membersBtn.className).toContain('border-primary')
    expect(membersBtn.className).toContain('text-primary')
  })

  it('applies active styles to danger tab when active', () => {
    render(<WorkspaceSettingsTabs activeTab="danger" onTabChange={vi.fn()} />)
    const dangerBtn = screen.getByText('Danger Zone').closest('button')!
    expect(dangerBtn.className).toContain('border-primary')
    expect(dangerBtn.className).toContain('text-primary')
  })

  it('renders icons in each tab button', () => {
    const { container } = render(<WorkspaceSettingsTabs {...defaultProps} />)
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBe(3)
    buttons.forEach(btn => {
      expect(btn.querySelector('svg')).toBeInTheDocument()
    })
  })
})
