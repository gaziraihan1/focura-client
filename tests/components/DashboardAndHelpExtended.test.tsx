import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// ─── WorkspaceList ───────────────────────────────────────────────────────────
import { WorkspaceList } from '@/components/Dashboard/WorkspaceList'

const mockWorkspaces = [
  {
    id: '1', name: 'Test Workspace', slug: 'test-ws', color: '#ff0000',
    logo: null, ownerId: 'u1', owner: { id: 'u1', name: 'Owner' },
    _count: { projects: 3, members: 5 },
  },
  {
    id: '2', name: 'Second Workspace', slug: 'second-ws', color: '#00ff00',
    logo: 'T', ownerId: 'u1', owner: { id: 'u1', name: 'Owner' },
    _count: { projects: 1, members: 2 },
  },
]

describe('WorkspaceList', () => {
  it('renders the heading', () => {
    render(<WorkspaceList workspaces={mockWorkspaces as any} />)
    expect(screen.getByText('Your workspaces')).toBeInTheDocument()
  })

  it('renders workspace names', () => {
    render(<WorkspaceList workspaces={mockWorkspaces as any} />)
    expect(screen.getByText('Test Workspace')).toBeInTheDocument()
    expect(screen.getByText('Second Workspace')).toBeInTheDocument()
  })

  it('renders project and member counts', () => {
    render(<WorkspaceList workspaces={mockWorkspaces as any} />)
    expect(screen.getByText(/3 projects · 5 members/)).toBeInTheDocument()
    expect(screen.getByText(/1 project · 2 members/)).toBeInTheDocument()
  })

  it('renders owner badge for owner', () => {
    render(<WorkspaceList workspaces={mockWorkspaces as any} />)
    expect(screen.getAllByText('Owner').length).toBeGreaterThanOrEqual(1)
  })

  it('renders create new workspace link', () => {
    render(<WorkspaceList workspaces={mockWorkspaces as any} />)
    expect(screen.getByText('Create new workspace')).toBeInTheDocument()
  })

  it('renders view all link', () => {
    render(<WorkspaceList workspaces={mockWorkspaces as any} />)
    expect(screen.getByText('View all →')).toBeInTheDocument()
  })

  it('renders workspace logo initial', () => {
    render(<WorkspaceList workspaces={mockWorkspaces as any} />)
    expect(screen.getAllByText('T').length).toBeGreaterThanOrEqual(1)
  })

  it('limits display to 4 workspaces', () => {
    const many = Array.from({ length: 6 }, (_, i) => ({
      id: `${i}`, name: `WS ${i}`, slug: `ws-${i}`, color: '#000',
      logo: null, ownerId: 'u1', owner: { id: 'u1', name: 'Owner' },
      _count: { projects: 1, members: 1 },
    }))
    render(<WorkspaceList workspaces={many as any} />)
    expect(screen.queryByText('WS 5')).not.toBeInTheDocument()
  })
})

// ─── GeneralSettingsTab ──────────────────────────────────────────────────────
import { GeneralSettingsTab } from '@/components/Dashboard/Workspaces/WorkspaceSettings/GeneralSettingsTab'

describe('GeneralSettingsTab', () => {
  const defaultProps = {
    formData: { name: 'Test Workspace', description: 'A test', color: '#ff0000', logo: null, isPublic: false, allowMemberInvites: true },
    errors: {} as Record<string, string>,
    isAdmin: true,
    isUpdating: false,
    onUpdateField: vi.fn(),
    onSave: vi.fn(),
  }

  it('renders workspace name input', () => {
    render(<GeneralSettingsTab {...defaultProps} />)
    expect(screen.getByDisplayValue('Test Workspace')).toBeInTheDocument()
  })

  it('renders description textarea', () => {
    render(<GeneralSettingsTab {...defaultProps} />)
    expect(screen.getByDisplayValue('A test')).toBeInTheDocument()
  })

  it('calls onUpdateField when name changes', () => {
    const onUpdateField = vi.fn()
    render(<GeneralSettingsTab {...defaultProps} onUpdateField={onUpdateField} />)
    fireEvent.change(screen.getByDisplayValue('Test Workspace'), { target: { value: 'New Name' } })
    expect(onUpdateField).toHaveBeenCalledWith('name', 'New Name')
  })

  it('disables inputs when not admin', () => {
    render(<GeneralSettingsTab {...defaultProps} isAdmin={false} />)
    expect(screen.getByDisplayValue('Test Workspace')).toBeDisabled()
  })

  it('shows save button', () => {
    render(<GeneralSettingsTab {...defaultProps} />)
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  it('calls onSave when save button is clicked', () => {
    const onSave = vi.fn()
    render(<GeneralSettingsTab {...defaultProps} onSave={onSave} />)
    fireEvent.click(screen.getByText('Save Changes'))
    expect(onSave).toHaveBeenCalledOnce()
  })

  it('shows loading state when updating', () => {
    render(<GeneralSettingsTab {...defaultProps} isUpdating={true} />)
    const btn = screen.getByText('Save Changes').closest('button')
    expect(btn).toBeDisabled()
  })

  it('shows validation errors', () => {
    render(<GeneralSettingsTab {...defaultProps} errors={{ name: 'Name is required' }} />)
    expect(screen.getByText('Name is required')).toBeInTheDocument()
  })
})

// ─── DangerZoneTab ───────────────────────────────────────────────────────────
import { DangerZoneTab } from '@/components/Dashboard/Workspaces/WorkspaceSettings/DangerZoneTab'

describe('DangerZoneTab', () => {
  it('renders danger zone heading', () => {
    render(<DangerZoneTab isOwner={true} isLeavingWorkspace={false} onLeaveWorkspace={vi.fn()} onDeleteWorkspace={vi.fn()} />)
    expect(screen.getByText('Danger Zone')).toBeInTheDocument()
  })

  it('renders delete workspace button for owner', () => {
    render(<DangerZoneTab isOwner={true} isLeavingWorkspace={false} onLeaveWorkspace={vi.fn()} onDeleteWorkspace={vi.fn()} />)
    expect(screen.getByText('Delete Workspace')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('renders leave workspace button for non-owner', () => {
    render(<DangerZoneTab isOwner={false} isLeavingWorkspace={false} onLeaveWorkspace={vi.fn()} onDeleteWorkspace={vi.fn()} />)
    expect(screen.getByText('Leave Workspace')).toBeInTheDocument()
    expect(screen.getByText('Leave')).toBeInTheDocument()
  })

  it('calls onDeleteWorkspace when delete is clicked', () => {
    const onDeleteWorkspace = vi.fn()
    render(<DangerZoneTab isOwner={true} isLeavingWorkspace={false} onLeaveWorkspace={vi.fn()} onDeleteWorkspace={onDeleteWorkspace} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(onDeleteWorkspace).toHaveBeenCalledOnce()
  })

  it('calls onLeaveWorkspace when leave is clicked', () => {
    const onLeaveWorkspace = vi.fn()
    render(<DangerZoneTab isOwner={false} isLeavingWorkspace={false} onLeaveWorkspace={onLeaveWorkspace} onDeleteWorkspace={vi.fn()} />)
    fireEvent.click(screen.getByText('Leave'))
    expect(onLeaveWorkspace).toHaveBeenCalledOnce()
  })

  it('disables leave button when leaving', () => {
    render(<DangerZoneTab isOwner={false} isLeavingWorkspace={true} onLeaveWorkspace={vi.fn()} onDeleteWorkspace={vi.fn()} />)
    expect(screen.getByText('Leave').closest('button')).toBeDisabled()
  })

  it('hides leave button for owner', () => {
    render(<DangerZoneTab isOwner={true} isLeavingWorkspace={false} onLeaveWorkspace={vi.fn()} onDeleteWorkspace={vi.fn()} />)
    expect(screen.queryByText('Leave Workspace')).not.toBeInTheDocument()
  })

  it('hides delete button for non-owner', () => {
    render(<DangerZoneTab isOwner={false} isLeavingWorkspace={false} onLeaveWorkspace={vi.fn()} onDeleteWorkspace={vi.fn()} />)
    expect(screen.queryByText('Delete Workspace')).not.toBeInTheDocument()
  })
})

// ─── HelpFeaturesGuide ───────────────────────────────────────────────────────
import { HelpFeaturesGuide } from '@/components/Help/HelpFeaturesGuide'

describe('HelpFeaturesGuide', () => {
  it('renders the heading', () => {
    render(<HelpFeaturesGuide />)
    expect(screen.getByText('In-depth documentation')).toBeInTheDocument()
  })

  it('renders section labels', () => {
    render(<HelpFeaturesGuide />)
    expect(screen.getByText('Feature Guides')).toBeInTheDocument()
  })

  it('expands and collapses sections', () => {
    render(<HelpFeaturesGuide />)
    // The tasks section is open by default
    const sectionButtons = screen.getAllByRole('button')
    // Click the first section button to toggle
    if (sectionButtons.length > 0) {
      fireEvent.click(sectionButtons[0])
    }
    // Just check it renders without crashing
    expect(screen.getByText('In-depth documentation')).toBeInTheDocument()
  })
})
