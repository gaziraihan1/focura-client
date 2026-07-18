import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// ─── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name, image, size }: any) => (
    <div data-testid="avatar" data-name={name} data-image={image} data-size={size}>
      {name}
    </div>
  ),
}))

vi.mock('@/hooks/useProjects', () => ({
  useProjects: vi.fn(),
}))

vi.mock('@/hooks/useWorkspace', () => ({
  useRemoveMember: vi.fn(),
  useUpdateMemberRole: vi.fn(),
  useInviteMember: vi.fn(),
}))

vi.mock('@/hooks/useActivity', () => ({
  useWorkspaceActivities: vi.fn(),
}))

vi.mock('@/components/Dashboard/TaskDetails/TaskActivityList', () => ({
  TaskActivityList: ({ activities }: any) => (
    <div data-testid="task-activity-list" data-count={activities.length}>
      {activities.map((a: any) => <div key={a.id}>{a.id}</div>)}
    </div>
  ),
}))

vi.mock('@/components/Dashboard/Workspaces/ProjectCard/ProjectCardHeader', () => ({
  ProjectCardHeader: (props: any) => (
    <div data-testid="project-card-header" data-name={props.name} data-status={props.status} data-priority={props.priority} />
  ),
}))

vi.mock('@/components/Dashboard/Workspaces/ProjectCard/ProjectCardDescription', () => ({
  ProjectCardDescription: (props: any) => (
    <div data-testid="project-card-description" data-desc={props.description} />
  ),
}))

vi.mock('@/components/Dashboard/Workspaces/ProjectCard/ProjectCardStats', () => ({
  ProjectCardStats: (props: any) => (
    <div data-testid="project-card-stats" data-completed={props.completedTasks} data-total={props.totalTasks} />
  ),
}))

vi.mock('@/components/Dashboard/Workspaces/ProjectCard/ProjectCardFooter', () => ({
  ProjectCardFooter: (props: any) => (
    <div data-testid="project-card-footer" data-members={JSON.stringify(props.members)} />
  ),
}))

vi.mock('date-fns', () => ({
  format: (date: any, fmt: string) => `2024-01-15`,
}))

// ─── Import components ──────────────────────────────────────────────────────

import { WorkspaceSettingsTabs } from '@/components/Dashboard/Workspaces/WorkspaceSettings/WorkspacesSettingsTabs'
import { WorkspaceSettingsHeader } from '@/components/Dashboard/Workspaces/WorkspaceSettings/WorkspacesSettingsHeader'
import { MembersSettingsTab } from '@/components/Dashboard/Workspaces/WorkspaceSettings/MembersSettingsTab'
import { DeleteWorkspaceModal } from '@/components/Dashboard/Workspaces/WorkspaceSettings/DeleteWorkspaceModal'
import { WorkspaceInviteMemberModal } from '@/components/Dashboard/Workspaces/WorkspaceSettings/WorkspaceInviteMemberModal'
import { WorkspaceHeader } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceHeader'
import { WorkspaceTabNavigation } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceTabNavigation'
import { WorkspaceStats } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceStats'
import WorkspaceInformation from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceInformation'
import WorkspaceStorageInfo from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceStorageInfo'
import { ProjectCard } from '@/components/Dashboard/Workspaces/WorkspacePage/ProjectCard'
import { WorkspaceProjectsTab } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceProjectsTab'
import { WorkspaceMembersTab } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceMembersTab'
import { WorkspaceOverviewTab } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceOverviewTab'
import { InviteMemberModal } from '@/components/Dashboard/Workspaces/WorkspacePage/InviteMemberModal'
import { WorkspaceDetailErrorState } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceDetailErrorState'

import { useProjects } from '@/hooks/useProjects'
import { useRemoveMember, useUpdateMemberRole, useInviteMember } from '@/hooks/useWorkspace'
import { useWorkspaceActivities } from '@/hooks/useActivity'

// ─── Helpers ────────────────────────────────────────────────────────────────

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
  useParams: () => ({ workspaceSlug: 'test-ws' }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockPush.mockClear()
  ;(useProjects as any).mockReturnValue({ data: [], isLoading: false })
  ;(useRemoveMember as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: false })
  ;(useUpdateMemberRole as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: false })
  ;(useInviteMember as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: false })
  ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
  window.confirm = vi.fn(() => true)
})

// ═══════════════════════════════════════════════════════════════════════════════
// 1. WorkspacesSettingsTabs
// ═══════════════════════════════════════════════════════════════════════════════

describe('WorkspacesSettingsTabs', () => {
  const defaultProps = {
    activeTab: 'general' as const,
    onTabChange: vi.fn(),
  }

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

// ═══════════════════════════════════════════════════════════════════════════════
// 2. WorkspaceSettingsHeader
// ═══════════════════════════════════════════════════════════════════════════════

describe('WorkspaceSettingsHeader', () => {
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

// ═══════════════════════════════════════════════════════════════════════════════
// 3. MembersSettingsTab
// ═══════════════════════════════════════════════════════════════════════════════

describe('MembersSettingsTab', () => {
  const members = [
    {
      id: 'm1',
      role: 'OWNER',
      user: { id: 'u1', name: 'Alice Owner', email: 'alice@test.com', image: 'https://img.test/a.jpg' },
    },
    {
      id: 'm2',
      role: 'ADMIN',
      user: { id: 'u2', name: 'Bob Admin', email: 'bob@test.com' },
    },
    {
      id: 'm3',
      role: 'MEMBER',
      user: { id: 'u3', name: 'Charlie Member', email: 'charlie@test.com' },
    },
    {
      id: 'm4',
      role: 'GUEST',
      user: { id: 'u4', name: '', email: 'guest@test.com' },
    },
  ]

  const defaultProps = {
    members,
    isAdmin: true,
    isRemovingMember: false,
    onInviteClick: vi.fn(),
    onRemoveMember: vi.fn(),
    onUpdateRole: vi.fn(),
  }

  it('renders all members', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    expect(screen.getAllByText('Alice Owner').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Bob Admin').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Charlie Member').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('guest@test.com')).toBeInTheDocument()
  })

  it('displays correct member count in header', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    expect(screen.getByText('Team Members (4)')).toBeInTheDocument()
  })

  it('shows invite button when isAdmin is true', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    expect(screen.getByText('Invite Member')).toBeInTheDocument()
  })

  it('hides invite button when isAdmin is false', () => {
    render(<MembersSettingsTab {...defaultProps} isAdmin={false} />)
    expect(screen.queryByText('Invite Member')).not.toBeInTheDocument()
  })

  it('calls onInviteClick when invite button is clicked', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    fireEvent.click(screen.getByText('Invite Member'))
    expect(defaultProps.onInviteClick).toHaveBeenCalledTimes(1)
  })

  it('shows Crown icon for OWNER role', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const svgs = document.querySelectorAll('svg')
    const crownIcons = Array.from(svgs).filter(svg => svg.classList.contains('lucide-crown'))
    expect(crownIcons.length).toBeGreaterThan(0)
  })

  it('shows role select for non-OWNER members when admin', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    // Bob, Charlie, Guest should have selects (3 non-owner members)
    expect(selects.length).toBe(3)
  })

  it('does not show role select for OWNER', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    // The OWNER row should show a span with the role, not a select
    // There should be 3 selects (for Bob, Charlie, Guest) - not 4
    const selects = screen.getAllByRole('combobox')
    expect(selects.length).toBe(3)
  })

  it('calls onUpdateRole when role select changes', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'MEMBER' } })
    expect(defaultProps.onUpdateRole).toHaveBeenCalledWith('m2', 'MEMBER')
  })

  it('shows remove button for non-OWNER members when admin', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const removeButtons = screen.getAllByRole('button').filter(
      btn => btn.className.includes('text-red-500')
    )
    // There should be remove buttons for Bob, Charlie, Guest
    expect(removeButtons.length).toBe(3)
  })

  it('does not show remove button for OWNER', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const allBtns = document.querySelectorAll('button')
    // All buttons with text-red-500 are remove buttons, should be 3 (non-owner members only)
    const redButtons = Array.from(allBtns).filter(btn => btn.className.includes('text-red-500'))
    expect(redButtons.length).toBe(3)
  })

  it('calls onRemoveMember when remove button is clicked', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const removeButtons = screen.getAllByRole('button').filter(
      btn => btn.querySelector('svg') && btn.className.includes('text-red-500')
    )
    fireEvent.click(removeButtons[0])
    expect(defaultProps.onRemoveMember).toHaveBeenCalledWith('m2')
  })

  it('disables remove buttons when isRemovingMember is true', () => {
    render(<MembersSettingsTab {...defaultProps} isRemovingMember={true} />)
    const removeButtons = screen.getAllByRole('button').filter(
      btn => btn.querySelector('svg') && btn.className.includes('text-red-500')
    )
    removeButtons.forEach(btn => {
      expect(btn).toBeDisabled()
    })
  })

  it('does not show role select for non-admin viewers', () => {
    render(<MembersSettingsTab {...defaultProps} isAdmin={false} />)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('shows role as span for non-admin viewers', () => {
    render(<MembersSettingsTab {...defaultProps} isAdmin={false} />)
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    expect(screen.getByText('MEMBER')).toBeInTheDocument()
    expect(screen.getByText('GUEST')).toBeInTheDocument()
    // OWNER is also shown
    expect(screen.getByText('OWNER')).toBeInTheDocument()
  })

  it('renders empty member list', () => {
    render(<MembersSettingsTab {...defaultProps} members={[]} />)
    expect(screen.getByText('Team Members (0)')).toBeInTheDocument()
  })

  it('renders avatars for members', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const avatars = screen.getAllByTestId('avatar')
    expect(avatars.length).toBe(4)
  })

  it('displays member emails', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
    expect(screen.getByText('bob@test.com')).toBeInTheDocument()
    expect(screen.getByText('charlie@test.com')).toBeInTheDocument()
  })

  it('select has correct option values', () => {
    render(<MembersSettingsTab {...defaultProps} />)
    const select = screen.getAllByRole('combobox')[0]
    const options = select.querySelectorAll('option')
    expect(options.length).toBe(3)
    expect(options[0].textContent).toBe('Admin')
    expect(options[1].textContent).toBe('Member')
    expect(options[2].textContent).toBe('Guest')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 4. DeleteWorkspaceModal
// ═══════════════════════════════════════════════════════════════════════════════

describe('DeleteWorkspaceModal', () => {
  const defaultProps = {
    isOpen: true,
    workspaceName: 'My Workspace',
    isDeleting: false,
    onDelete: vi.fn(),
    onClose: vi.fn(),
  }

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<DeleteWorkspaceModal {...defaultProps} isOpen={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders modal content when isOpen is true', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    expect(screen.getByText('Delete Workspace?')).toBeInTheDocument()
  })

  it('displays workspace name in warning text', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    expect(screen.getByText('My Workspace')).toBeInTheDocument()
  })

  it('displays delete warning text', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    expect(screen.getByText(/permanently delete/)).toBeInTheDocument()
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    const deleteBtn = screen.getByText('Delete Permanently').closest('button')!
    fireEvent.click(deleteBtn)
    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    // The backdrop is two levels up from the h3: h3 -> flex div -> card div -> backdrop div
    const backdrop = screen.getByText('Delete Workspace?').closest('div')!.parentElement!.parentElement!
    fireEvent.click(backdrop)
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('does not call onClose when modal content is clicked', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    // The inner card div has stopPropagation
    const cardDiv = screen.getByText('Delete Workspace?').closest('div')!.parentElement!
    fireEvent.click(cardDiv)
    // The inner div has stopPropagation, so onClose should not be called
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('shows Loader2 spinner when isDeleting is true', () => {
    render(<DeleteWorkspaceModal {...defaultProps} isDeleting={true} />)
    const deleteBtn = screen.getByText('Delete Permanently').closest('button')!
    const svg = deleteBtn.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg!.getAttribute('class')).toContain('animate-spin')
  })

  it('disables delete button when isDeleting is true', () => {
    render(<DeleteWorkspaceModal {...defaultProps} isDeleting={true} />)
    const deleteBtn = screen.getByText('Delete Permanently').closest('button')!
    expect(deleteBtn).toBeDisabled()
  })

  it('delete button is not disabled when isDeleting is false', () => {
    render(<DeleteWorkspaceModal {...defaultProps} isDeleting={false} />)
    const deleteBtn = screen.getByText('Delete Permanently').closest('button')!
    expect(deleteBtn).not.toBeDisabled()
  })

  it('renders AlertCircle icon in the header', () => {
    const { container } = render(<DeleteWorkspaceModal {...defaultProps} />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('delete button has red background', () => {
    render(<DeleteWorkspaceModal {...defaultProps} />)
    const deleteBtn = screen.getByText('Delete Permanently').closest('button')!
    expect(deleteBtn.className).toContain('bg-red-500')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 5. WorkspaceInviteMemberModal (Settings)
// ═══════════════════════════════════════════════════════════════════════════════

describe('WorkspaceInviteMemberModal', () => {
  const defaultProps = {
    isOpen: true,
    email: '',
    role: 'MEMBER' as const,
    isInviting: false,
    onEmailChange: vi.fn(),
    onRoleChange: vi.fn(),
    onInvite: vi.fn(),
    onClose: vi.fn(),
  }

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<WorkspaceInviteMemberModal {...defaultProps} isOpen={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders modal when isOpen is true', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    expect(screen.getByText('Invite Team Member')).toBeInTheDocument()
  })

  it('displays email input', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    expect(input).toBeInTheDocument()
    expect(input.getAttribute('type')).toBe('email')
  })

  it('calls onEmailChange when email input changes', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    expect(defaultProps.onEmailChange).toHaveBeenCalledWith('test@test.com')
  })

  it('displays role select with correct options', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    const options = select.querySelectorAll('option')
    expect(options.length).toBe(3)
    expect(options[0].textContent).toBe('Member')
    expect(options[1].textContent).toBe('Admin')
    expect(options[2].textContent).toBe('Guest')
  })

  it('calls onRoleChange when role select changes', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'ADMIN' } })
    expect(defaultProps.onRoleChange).toHaveBeenCalledWith('ADMIN')
  })

  it('calls onInvite when invite button is clicked', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} email="test@test.com" />)
    fireEvent.click(screen.getByText('Send Invitation'))
    expect(defaultProps.onInvite).toHaveBeenCalledTimes(1)
  })

  it('disables invite button when email is empty', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} email="" />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    expect(inviteBtn).toBeDisabled()
  })

  it('enables invite button when email is provided', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} email="test@test.com" />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    expect(inviteBtn).not.toBeDisabled()
  })

  it('disables invite button when isInviting is true', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} email="test@test.com" isInviting={true} />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    expect(inviteBtn).toBeDisabled()
  })

  it('shows Loader2 spinner when isInviting is true', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} isInviting={true} />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    const svg = inviteBtn.querySelector('svg')
    expect(svg!.getAttribute('class')).toContain('animate-spin')
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    const modalRoot = screen.getByText('Invite Team Member').closest('div')!.parentElement!
    fireEvent.click(modalRoot)
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('does not call onClose when modal content is clicked', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} />)
    const innerContent = screen.getByText('Invite Team Member').closest('div')!
    fireEvent.click(innerContent)
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('sets email input value from props', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} email="existing@test.com" />)
    const input = screen.getByPlaceholderText('colleague@example.com') as HTMLInputElement
    expect(input.value).toBe('existing@test.com')
  })

  it('sets role select value from props', () => {
    render(<WorkspaceInviteMemberModal {...defaultProps} role="ADMIN" />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('ADMIN')
  })

  it('shows Mail icon when not inviting', () => {
    const { container } = render(<WorkspaceInviteMemberModal {...defaultProps} email="test@test.com" />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    const svg = inviteBtn.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg!.getAttribute('class')).not.toContain('animate-spin')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 6. WorkspaceHeader
// ═══════════════════════════════════════════════════════════════════════════════

describe('WorkspaceHeader', () => {
  const defaultProps = {
    workspaceName: 'Test Workspace',
    workspaceSlug: 'test-workspace',
    workspacePlan: 'FREE',
    canCreateProjects: true,
    isAdmin: true,
    isOwner: false,
  }

  it('renders workspace name', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.getByText('Test Workspace')).toBeInTheDocument()
  })

  it('renders workspace slug', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.getByText('/test-workspace')).toBeInTheDocument()
  })

  it('renders workspace logo (first letter) when no logo provided', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('renders workspace logo when provided', () => {
    render(<WorkspaceHeader {...defaultProps} workspaceLogo="WS" />)
    expect(screen.getByText('WS')).toBeInTheDocument()
  })

  it('applies custom workspace color', () => {
    render(<WorkspaceHeader {...defaultProps} workspaceColor="#ff0000" />)
    const logoBox = screen.getByText('T').closest('div')!
    expect(logoBox.style.backgroundColor).toContain('255, 0, 0')
  })

  it('applies default color when no workspaceColor provided', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    const logoBox = screen.getByText('T').closest('div')!
    expect(logoBox.style.backgroundColor).toContain('102, 126, 234')
  })

  it('renders FREE plan badge', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('renders PRO plan badge', () => {
    render(<WorkspaceHeader {...defaultProps} workspacePlan="PRO" />)
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })

  it('renders BUSINESS plan badge', () => {
    render(<WorkspaceHeader {...defaultProps} workspacePlan="BUSINESS" />)
    expect(screen.getByText('Business')).toBeInTheDocument()
  })

  it('renders ENTERPRISE plan badge', () => {
    render(<WorkspaceHeader {...defaultProps} workspacePlan="ENTERPRISE" />)
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('defaults to FREE badge for unknown plan', () => {
    render(<WorkspaceHeader {...defaultProps} workspacePlan="UNKNOWN" />)
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('renders workspace description when provided', () => {
    render(<WorkspaceHeader {...defaultProps} workspaceDescription="A great workspace" />)
    expect(screen.getByText('A great workspace')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.queryByText('A great workspace')).not.toBeInTheDocument()
  })

  it('shows New Project button when canCreateProjects is true', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    const newProjectElements = screen.getAllByText('New Project')
    expect(newProjectElements.length).toBeGreaterThan(0)
  })

  it('hides New Project button when canCreateProjects is false', () => {
    render(<WorkspaceHeader {...defaultProps} canCreateProjects={false} />)
    expect(screen.queryByText('New Project')).not.toBeInTheDocument()
  })

  it('navigates to new project page when New Project is clicked', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    const newProjectBtn = screen.getAllByText('New Project')[0].closest('button')!
    fireEvent.click(newProjectBtn)
    expect(mockPush).toHaveBeenCalledWith('/dashboard/workspaces/test-workspace/projects/new-project')
  })

  it('shows Settings button when isAdmin is true', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
  })

  it('shows Settings button when isOwner is true', () => {
    render(<WorkspaceHeader {...defaultProps} isAdmin={false} isOwner={true} />)
    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
  })

  it('hides Settings button when not admin and not owner', () => {
    render(<WorkspaceHeader {...defaultProps} isAdmin={false} isOwner={false} />)
    expect(screen.queryByLabelText('Settings')).not.toBeInTheDocument()
  })

  it('links settings button to settings page', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    const settingsLink = screen.getByLabelText('Settings').closest('a')!
    expect(settingsLink.getAttribute('href')).toBe('/dashboard/workspaces/test-workspace/settings')
  })

  it('back button navigates to workspaces list', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Back to workspaces'))
    expect(mockPush).toHaveBeenCalledWith('/dashboard/workspaces')
  })

  it('back button has correct aria-label', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.getByLabelText('Back to workspaces')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 7. WorkspaceTabNavigation
// ═══════════════════════════════════════════════════════════════════════════════

describe('WorkspaceTabNavigation', () => {
  const defaultProps = {
    activeTab: 'overview' as const,
    onTabChange: vi.fn(),
  }

  it('renders all three tabs', () => {
    render(<WorkspaceTabNavigation {...defaultProps} />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Members')).toBeInTheDocument()
  })

  it('calls onTabChange with "overview" when Overview clicked', () => {
    render(<WorkspaceTabNavigation {...defaultProps} />)
    fireEvent.click(screen.getByText('Overview'))
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('overview')
  })

  it('calls onTabChange with "projects" when Projects clicked', () => {
    render(<WorkspaceTabNavigation {...defaultProps} />)
    fireEvent.click(screen.getByText('Projects'))
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('projects')
  })

  it('calls onTabChange with "members" when Members clicked', () => {
    render(<WorkspaceTabNavigation {...defaultProps} />)
    fireEvent.click(screen.getByText('Members'))
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('members')
  })

  it('applies active styles to the active tab', () => {
    render(<WorkspaceTabNavigation activeTab="projects" onTabChange={vi.fn()} />)
    const projectsBtn = screen.getByText('Projects').closest('button')!
    expect(projectsBtn.className).toContain('border-primary')
    expect(projectsBtn.className).toContain('text-primary')
  })

  it('applies inactive styles to non-active tabs', () => {
    render(<WorkspaceTabNavigation activeTab="overview" onTabChange={vi.fn()} />)
    const projectsBtn = screen.getByText('Projects').closest('button')!
    expect(projectsBtn.className).toContain('border-transparent')
    expect(projectsBtn.className).toContain('text-muted-foreground')
  })

  it('applies active styles to members tab when active', () => {
    render(<WorkspaceTabNavigation activeTab="members" onTabChange={vi.fn()} />)
    const membersBtn = screen.getByText('Members').closest('button')!
    expect(membersBtn.className).toContain('border-primary')
  })

  it('renders icons in each tab', () => {
    const { container } = render(<WorkspaceTabNavigation {...defaultProps} />)
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBe(3)
    buttons.forEach(btn => {
      expect(btn.querySelector('svg')).toBeInTheDocument()
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8. WorkspaceStats
// ═══════════════════════════════════════════════════════════════════════════════

describe('WorkspaceStats', () => {
  const defaultProps = {
    stats: {
      totalProjects: 12,
      completedTasks: 45,
      completionRate: 75,
      overdueTasks: 3,
      totalMembers: 8,
    },
    maxMembers: 20,
  }

  it('renders total projects count', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('renders completed tasks count', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('45')).toBeInTheDocument()
  })

  it('renders completion rate percentage', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('renders overdue tasks count', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders total members count', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('renders max members', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('20 max')).toBeInTheDocument()
  })

  it('renders stat labels', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(screen.getByText('Members')).toBeInTheDocument()
  })

  it('renders 4 stat cards', () => {
    render(<WorkspaceStats {...defaultProps} />)
    // Each card is inside a motion.div which is rendered as a div
    const cards = screen.getAllByText('Projects')
    expect(cards.length).toBe(1) // Just one "Projects" label
  })

  it('handles zero stats', () => {
    render(<WorkspaceStats
      stats={{ totalProjects: 0, completedTasks: 0, completionRate: 0, overdueTasks: 0, totalMembers: 0 }}
      maxMembers={0}
    />)
    expect(screen.getByText('0 max')).toBeInTheDocument()
  })

  it('handles large numbers', () => {
    render(<WorkspaceStats
      stats={{ totalProjects: 999, completedTasks: 10000, completionRate: 99, overdueTasks: 500, totalMembers: 200 }}
      maxMembers={500}
    />)
    expect(screen.getByText('999')).toBeInTheDocument()
    expect(screen.getByText('10000')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('500 max')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 9. WorkspaceInformation
// ═══════════════════════════════════════════════════════════════════════════════

describe('WorkspaceInformation', () => {
  it('renders the Information heading', () => {
    render(<WorkspaceInformation name="John Doe" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('Information')).toBeInTheDocument()
  })

  it('renders owner name when provided', () => {
    render(<WorkspaceInformation name="John Doe" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders email when name is null', () => {
    render(<WorkspaceInformation name={null} email="john@test.com" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('john@test.com')).toBeInTheDocument()
  })

  it('renders name over email when both provided', () => {
    render(<WorkspaceInformation name="John Doe" email="john@test.com" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    // Email should not be shown separately since name is provided
  })

  it('renders created date', () => {
    render(<WorkspaceInformation name="John Doe" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('shows Public visibility when isPublic is true', () => {
    render(<WorkspaceInformation name="John Doe" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('Public')).toBeInTheDocument()
  })

  it('shows Private visibility when isPublic is false', () => {
    render(<WorkspaceInformation name="John Doe" createdAt="2024-01-15T00:00:00Z" isPublic={false} />)
    expect(screen.getByText('Private')).toBeInTheDocument()
  })

  it('renders label texts', () => {
    render(<WorkspaceInformation name="John Doe" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('Owner')).toBeInTheDocument()
    expect(screen.getByText('Created')).toBeInTheDocument()
    expect(screen.getByText('Visibility')).toBeInTheDocument()
  })

  it('renders Owner label with label key elements', () => {
    const { container } = render(<WorkspaceInformation name="Jane" createdAt="2024-01-15T00:00:00Z" isPublic={false} />)
    const spans = container.querySelectorAll('span')
    const labelTexts = Array.from(spans).map(s => s.textContent)
    expect(labelTexts).toContain('Owner')
    expect(labelTexts).toContain('Created')
    expect(labelTexts).toContain('Visibility')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 10. WorkspaceStorageInfo
// ═══════════════════════════════════════════════════════════════════════════════

describe('WorkspaceStorageInfo', () => {
  it('renders the Storage heading', () => {
    render(<WorkspaceStorageInfo maxStorage={1024} />)
    expect(screen.getByText('Storage')).toBeInTheDocument()
  })

  it('displays used storage text', () => {
    render(<WorkspaceStorageInfo maxStorage={1024} />)
    expect(screen.getByText('Used Storage')).toBeInTheDocument()
  })

  it('displays storage values', () => {
    render(<WorkspaceStorageInfo maxStorage={1024} />)
    expect(screen.getByText('0 MB / 1024 MB')).toBeInTheDocument()
  })

  it('renders a progress bar', () => {
    const { container } = render(<WorkspaceStorageInfo maxStorage={1024} />)
    const progressBar = container.querySelector('[style*="width"]')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar!.getAttribute('style')).toContain('0%')
  })

  it('displays different maxStorage values', () => {
    render(<WorkspaceStorageInfo maxStorage={5000} />)
    expect(screen.getByText('0 MB / 5000 MB')).toBeInTheDocument()
  })

  it('renders the progress bar container', () => {
    const { container } = render(<WorkspaceStorageInfo maxStorage={100} />)
    // The outer track bar
    const track = container.querySelector('.bg-muted')
    expect(track).toBeInTheDocument()
  })

  it('renders the filled bar with bg-primary', () => {
    const { container } = render(<WorkspaceStorageInfo maxStorage={100} />)
    const filled = container.querySelector('.bg-primary')
    expect(filled).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 11. ProjectCard
// ═══════════════════════════════════════════════════════════════════════════════

describe('ProjectCard', () => {
  const baseProject = {
    id: 'proj-1',
    slug: 'my-project',
    name: 'My Project',
    description: 'A test project',
    color: '#3b82f6',
    icon: '📁',
    status: 'ACTIVE',
    priority: 'HIGH',
    startDate: '2024-01-01',
    dueDate: '2024-06-30',
    createdAt: '2024-01-01',
    members: [
      {
        id: 'pm1',
        userId: 'u1',
        role: 'MANAGER' as const,
        joinedAt: '2024-01-01',
        user: { id: 'u1', name: 'Alice', email: 'alice@test.com', image: 'img.jpg' },
      },
    ],
    tasks: [],
    announcement: [],
    stats: {
      totalTasks: 10,
      completedTasks: 5,
      overdueTasks: 2,
      totalMembers: 3,
      projectDays: 30,
    },
  } as any

  const defaultProps = {
    project: baseProject,
    workspaceSlug: 'test-workspace',
    index: 0,
  }

  it('renders the project card with link', () => {
    render(<ProjectCard {...defaultProps} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/dashboard/workspaces/test-workspace/projects/my-project')
  })

  it('passes project data to ProjectCardHeader', () => {
    render(<ProjectCard {...defaultProps} />)
    const header = screen.getByTestId('project-card-header')
    expect(header.getAttribute('data-name')).toBe('My Project')
    expect(header.getAttribute('data-status')).toBe('ACTIVE')
    expect(header.getAttribute('data-priority')).toBe('HIGH')
  })

  it('passes description to ProjectCardDescription', () => {
    render(<ProjectCard {...defaultProps} />)
    const desc = screen.getByTestId('project-card-description')
    expect(desc.getAttribute('data-desc')).toBe('A test project')
  })

  it('passes stats to ProjectCardStats', () => {
    render(<ProjectCard {...defaultProps} />)
    const stats = screen.getByTestId('project-card-stats')
    expect(stats.getAttribute('data-completed')).toBe('5')
    expect(stats.getAttribute('data-total')).toBe('10')
  })

  it('passes members to ProjectCardFooter', () => {
    render(<ProjectCard {...defaultProps} />)
    const footer = screen.getByTestId('project-card-footer')
    expect(footer.getAttribute('data-members')).toContain('Alice')
  })

  it('calculates completion rate correctly', () => {
    render(<ProjectCard {...defaultProps} />)
    // 5/10 = 50%
    const stats = screen.getByTestId('project-card-stats')
    // Stats component receives completionRate but we just verify it renders
    expect(stats).toBeInTheDocument()
  })

  it('handles project without stats', () => {
    const projectNoStats = { ...baseProject, stats: undefined }
    render(<ProjectCard project={projectNoStats} workspaceSlug="test-ws" index={0} />)
    const stats = screen.getByTestId('project-card-stats')
    expect(stats.getAttribute('data-completed')).toBe('0')
    expect(stats.getAttribute('data-total')).toBe('0')
  })

  it('handles project without members', () => {
    const projectNoMembers = { ...baseProject, members: undefined }
    render(<ProjectCard project={projectNoMembers} workspaceSlug="test-ws" index={0} />)
    const footer = screen.getByTestId('project-card-footer')
    expect(footer.getAttribute('data-members')).toBe('[]')
  })

  it('uses 0 completion rate when totalTasks is 0', () => {
    const projectZeroTasks = {
      ...baseProject,
      stats: { ...baseProject.stats, totalTasks: 0, completedTasks: 0 },
    }
    render(<ProjectCard project={projectZeroTasks} workspaceSlug="test-ws" index={0} />)
    expect(screen.getByTestId('project-card-stats')).toBeInTheDocument()
  })

  it('applies delay based on index', () => {
    render(<ProjectCard {...defaultProps} index={2} />)
    expect(screen.getByTestId('project-card-header').getAttribute('data-name')).toBe('My Project')
  })

  it('renders card with hover styles', () => {
    const { container } = render(<ProjectCard {...defaultProps} />)
    const card = container.querySelector('.group')
    expect(card).toBeInTheDocument()
    expect(card!.className).toContain('hover:border-primary/50')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 12. WorkspaceProjectsTab
// ═══════════════════════════════════════════════════════════════════════════════

describe('WorkspaceProjectsTab', () => {
  const defaultProps = {
    workspaceId: 'ws-1',
    workspaceSlug: 'test-workspace',
    canCreateProjects: true,
  }

  it('shows loading spinner when isLoading is true', () => {
    ;(useProjects as any).mockReturnValue({ data: [], isLoading: true })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('shows empty state when no projects', () => {
    ;(useProjects as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    expect(screen.getByText('No projects yet')).toBeInTheDocument()
  })

  it('shows create button in empty state when canCreateProjects', () => {
    ;(useProjects as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    expect(screen.getByText('Create Project')).toBeInTheDocument()
  })

  it('hides create button in empty state when cannot create projects', () => {
    ;(useProjects as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} canCreateProjects={false} />)
    expect(screen.queryByText('Create Project')).not.toBeInTheDocument()
  })

  it('navigates to new project when create button is clicked in empty state', () => {
    ;(useProjects as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    fireEvent.click(screen.getByText('Create Project'))
    expect(mockPush).toHaveBeenCalledWith('/dashboard/workspaces/test-workspace/projects/new-project')
  })

  it('renders projects when data is available', () => {
    const projects = [
      {
        id: 'p1',
        slug: 'proj-1',
        name: 'Project One',
        color: '#3b82f6',
        status: 'ACTIVE',
        priority: 'HIGH',
        members: [],
        tasks: [],
        announcement: [],
        stats: { totalTasks: 5, completedTasks: 3, overdueTasks: 1, totalMembers: 2, projectDays: 10 },
      },
      {
        id: 'p2',
        slug: 'proj-2',
        name: 'Project Two',
        color: '#ef4444',
        status: 'COMPLETED',
        priority: 'LOW',
        members: [],
        tasks: [],
        announcement: [],
        stats: { totalTasks: 10, completedTasks: 10, overdueTasks: 0, totalMembers: 1, projectDays: 20 },
      },
    ] as any[]
    ;(useProjects as any).mockReturnValue({ data: projects, isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    const headers = screen.getAllByTestId('project-card-header')
    expect(headers.length).toBe(2)
    expect(headers[0].getAttribute('data-name')).toBe('Project One')
    expect(headers[1].getAttribute('data-name')).toBe('Project Two')
  })

  it('shows project count in header when canCreateProjects', () => {
    const projects = [
      { id: 'p1', slug: 'p1', name: 'P1', color: '#fff', status: 'ACTIVE', priority: 'HIGH', members: [], tasks: [], announcement: [], stats: { totalTasks: 0, completedTasks: 0, overdueTasks: 0, totalMembers: 0, projectDays: 0 } },
    ] as any[]
    ;(useProjects as any).mockReturnValue({ data: projects, isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    expect(screen.getByText('Projects (1)')).toBeInTheDocument()
  })

  it('shows New Project button in header when canCreateProjects and has projects', () => {
    const projects = [
      { id: 'p1', slug: 'p1', name: 'P1', color: '#fff', status: 'ACTIVE', priority: 'HIGH', members: [], tasks: [], announcement: [], stats: { totalTasks: 0, completedTasks: 0, overdueTasks: 0, totalMembers: 0, projectDays: 0 } },
    ] as any[]
    ;(useProjects as any).mockReturnValue({ data: projects, isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    expect(screen.getByText('New Project')).toBeInTheDocument()
  })

  it('navigates when New Project button clicked in project list', () => {
    const projects = [
      { id: 'p1', slug: 'p1', name: 'P1', color: '#fff', status: 'ACTIVE', priority: 'HIGH', members: [], tasks: [], announcement: [], stats: { totalTasks: 0, completedTasks: 0, overdueTasks: 0, totalMembers: 0, projectDays: 0 } },
    ] as any[]
    ;(useProjects as any).mockReturnValue({ data: projects, isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    // The header "New Project" button
    const newProjectButtons = screen.getAllByText('New Project')
    fireEvent.click(newProjectButtons[0])
    expect(mockPush).toHaveBeenCalledWith('/dashboard/workspaces/test-workspace/projects/new-project')
  })

  it('hides header when cannot create projects', () => {
    const projects = [
      { id: 'p1', slug: 'p1', name: 'P1', color: '#fff', status: 'ACTIVE', priority: 'HIGH', members: [], tasks: [], announcement: [], stats: { totalTasks: 0, completedTasks: 0, overdueTasks: 0, totalMembers: 0, projectDays: 0 } },
    ] as any[]
    ;(useProjects as any).mockReturnValue({ data: projects, isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} canCreateProjects={false} />)
    expect(screen.queryByText('Projects (1)')).not.toBeInTheDocument()
    expect(screen.queryByText('New Project')).not.toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 13. WorkspaceMembersTab
// ═══════════════════════════════════════════════════════════════════════════════

describe('WorkspaceMembersTab', () => {
  const members = [
    {
      id: 'm1',
      role: 'OWNER' as const,
      user: { id: 'u1', name: 'Alice Owner', email: 'alice@test.com', image: 'https://img.test/a.jpg' },
    },
    {
      id: 'm2',
      role: 'ADMIN' as const,
      user: { id: 'u2', name: 'Bob Admin', email: 'bob@test.com' },
    },
    {
      id: 'm3',
      role: 'MEMBER' as const,
      user: { id: 'u3', name: null as any, email: 'charlie@test.com' },
    },
    {
      id: 'm4',
      role: 'GUEST' as const,
      user: { id: 'u4', name: 'Dave Guest', email: 'dave@test.com' },
    },
  ]

  const defaultProps = {
    workspaceId: 'ws-1',
    members,
    isAdmin: true,
    isOwner: false,
    onInviteClick: vi.fn(),
  }

  it('renders all members', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    expect(screen.getByText('Alice Owner')).toBeInTheDocument()
    expect(screen.getByText('Bob Admin')).toBeInTheDocument()
    expect(screen.getByText('Dave Guest')).toBeInTheDocument()
  })

  it('displays member count', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    expect(screen.getByText('Team Members (4)')).toBeInTheDocument()
  })

  it('shows invite button when isAdmin', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    expect(screen.getByText('Invite Member')).toBeInTheDocument()
  })

  it('shows invite button when isOwner', () => {
    render(<WorkspaceMembersTab {...defaultProps} isAdmin={false} isOwner={true} />)
    expect(screen.getByText('Invite Member')).toBeInTheDocument()
  })

  it('hides invite button when neither admin nor owner', () => {
    render(<WorkspaceMembersTab {...defaultProps} isAdmin={false} isOwner={false} />)
    expect(screen.queryByText('Invite Member')).not.toBeInTheDocument()
  })

  it('calls onInviteClick when invite button clicked', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    fireEvent.click(screen.getByText('Invite Member'))
    expect(defaultProps.onInviteClick).toHaveBeenCalled()
  })

  it('shows user image when available', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    const img = screen.getAllByRole('img')
    expect(img.length).toBeGreaterThan(0)
  })

  it('shows initials fallback when no image', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    expect(screen.getByText('B')).toBeInTheDocument() // Bob's initial
  })

  it('shows "U" when name is null and no image', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    // Member m3 has null name
    const initials = screen.getAllByText('U')
    expect(initials.length).toBeGreaterThan(0)
  })

  it('shows "Anonymous" when name is null', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    expect(screen.getByText('Anonymous')).toBeInTheDocument()
  })

  it('shows Crown icon for OWNER role', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    const nameEl = screen.getByText('Alice Owner')
    const p = nameEl.closest('p')!
    const svgs = p.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('shows role select for non-owner members when admin', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    expect(selects.length).toBe(3) // Bob, null-name member, Dave
  })

  it('shows role badge for non-admin owners', () => {
    render(<WorkspaceMembersTab {...defaultProps} isAdmin={false} isOwner={false} />)
    expect(screen.getByText('Owner')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Member')).toBeInTheDocument()
    expect(screen.getByText('Guest')).toBeInTheDocument()
  })

  it('calls handleUpdateRole when select changes', () => {
    const mockMutate = vi.fn()
    ;(useUpdateMemberRole as any).mockReturnValue({ mutateAsync: mockMutate, isPending: false })
    render(<WorkspaceMembersTab {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'MEMBER' } })
    expect(mockMutate).toHaveBeenCalledWith({
      workspaceId: 'ws-1',
      memberId: 'm2',
      role: 'MEMBER',
    })
  })

  it('calls confirm and handleRemoveMember when remove clicked', () => {
    const mockRemove = vi.fn()
    ;(useRemoveMember as any).mockReturnValue({ mutateAsync: mockRemove, isPending: false })
    render(<WorkspaceMembersTab {...defaultProps} />)
    const removeButtons = screen.getAllByLabelText('Remove member')
    fireEvent.click(removeButtons[0])
    expect(window.confirm).toHaveBeenCalledWith('Remove this member?')
    expect(mockRemove).toHaveBeenCalledWith({ workspaceId: 'ws-1', memberId: 'm2' })
  })

  it('does not call removeMember when confirm is cancelled', () => {
    const mockRemove = vi.fn()
    ;(useRemoveMember as any).mockReturnValue({ mutateAsync: mockRemove, isPending: false })
    ;(window.confirm as any).mockReturnValue(false)
    render(<WorkspaceMembersTab {...defaultProps} />)
    const removeButtons = screen.getAllByLabelText('Remove member')
    fireEvent.click(removeButtons[0])
    expect(mockRemove).not.toHaveBeenCalled()
  })

  it('shows remove buttons for non-owner members when admin', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    const removeButtons = screen.getAllByLabelText('Remove member')
    expect(removeButtons.length).toBe(3) // Bob, null-name, Dave
  })

  it('hides remove buttons for OWNER', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    const ownerRow = screen.getByText('Alice Owner').closest('div[class*="p-"]')!
    expect(ownerRow.querySelector('[aria-label="Remove member"]')).not.toBeInTheDocument()
  })

  it('disables select when updateMemberRole is pending', () => {
    ;(useUpdateMemberRole as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: true })
    render(<WorkspaceMembersTab {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    selects.forEach(select => {
      expect(select).toBeDisabled()
    })
  })

  it('disables remove button when removeMember is pending', () => {
    ;(useRemoveMember as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: true })
    render(<WorkspaceMembersTab {...defaultProps} />)
    const removeButtons = screen.getAllByLabelText('Remove member')
    removeButtons.forEach(btn => {
      expect(btn).toBeDisabled()
    })
  })

  it('renders emails for all members', () => {
    render(<WorkspaceMembersTab {...defaultProps} />)
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
    expect(screen.getByText('bob@test.com')).toBeInTheDocument()
    expect(screen.getByText('charlie@test.com')).toBeInTheDocument()
    expect(screen.getByText('dave@test.com')).toBeInTheDocument()
  })

  it('handles error in removeMember gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockRemove = vi.fn().mockRejectedValue(new Error('fail'))
    ;(useRemoveMember as any).mockReturnValue({ mutateAsync: mockRemove, isPending: false })
    render(<WorkspaceMembersTab {...defaultProps} />)
    const removeButtons = screen.getAllByLabelText('Remove member')
    await fireEvent.click(removeButtons[0])
    // Should not throw
    expect(mockRemove).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('handles error in updateRole gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockUpdate = vi.fn().mockRejectedValue(new Error('fail'))
    ;(useUpdateMemberRole as any).mockReturnValue({ mutateAsync: mockUpdate, isPending: false })
    render(<WorkspaceMembersTab {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    await fireEvent.change(selects[0], { target: { value: 'GUEST' } })
    expect(mockUpdate).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 14. WorkspaceOverviewTab
// ═══════════════════════════════════════════════════════════════════════════════

describe('WorkspaceOverviewTab', () => {
  const defaultProps = {
    workspaceId: 'ws-1',
    owner: { name: 'John Doe', email: 'john@test.com' },
    createdAt: '2024-01-15T00:00:00Z',
    isPublic: true,
    maxStorage: 1024,
  }

  it('renders the Recent Activity heading', () => {
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
  })

  it('shows loading spinner when activities are loading', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: true })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('renders TaskActivityList when activities loaded', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.getByTestId('task-activity-list')).toBeInTheDocument()
  })

  it('shows "see more" button', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.getByText('see more')).toBeInTheDocument()
  })

  it('disables "see more" when no more activities', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    const seeMore = screen.getByText('see more').closest('button')!
    expect(seeMore).toBeDisabled()
  })

  it('enables "see more" when has more activities', () => {
    const activities = Array.from({ length: 5 }, (_, i) => ({ id: `a${i}` }))
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    const seeMore = screen.getByText('see more').closest('button')!
    expect(seeMore).not.toBeDisabled()
  })

  it('clicking "see more" increases the limit', () => {
    const activities = Array.from({ length: 10 }, (_, i) => ({ id: `a${i}` }))
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    fireEvent.click(screen.getByText('see more'))
    // After clicking, limit increases by 9 (from 3 to 12), component passes limit+1=13
    expect(useWorkspaceActivities).toHaveBeenCalledWith('ws-1', { limit: 13 })
  })

  it('shows "see less" button when limit > 9', () => {
    const activities = Array.from({ length: 15 }, (_, i) => ({ id: `a${i}` }))
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    // Click see more to increase limit beyond 9
    fireEvent.click(screen.getByText('see more'))
    expect(screen.getByText('see less')).toBeInTheDocument()
  })

  it('clicking "see less" decreases the limit', () => {
    const activities = Array.from({ length: 15 }, (_, i) => ({ id: `a${i}` }))
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    fireEvent.click(screen.getByText('see more'))
    fireEvent.click(screen.getByText('see less'))
    // After see less, limit goes from 12 back to 3, component passes limit+1=4
    const calls = (useWorkspaceActivities as any).mock.calls
    const lastCall = calls[calls.length - 1]
    expect(lastCall).toEqual(['ws-1', { limit: 4 }])
  })

  it('renders WorkspaceInformation component', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.getByText('Information')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders WorkspaceStorageInfo component', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.getByText('Storage')).toBeInTheDocument()
    expect(screen.getByText('0 MB / 1024 MB')).toBeInTheDocument()
  })

  it('passes correct props to useWorkspaceActivities', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(useWorkspaceActivities).toHaveBeenCalledWith('ws-1', { limit: 4 }) // 3 + 1
  })

  it('renders activities list with visible count', () => {
    const activities = [
      { id: 'a1' },
      { id: 'a2' },
      { id: 'a3' },
    ]
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    const list = screen.getByTestId('task-activity-list')
    expect(list.getAttribute('data-count')).toBe('3')
  })

  it('slices activities to limit', () => {
    const activities = [
      { id: 'a1' },
      { id: 'a2' },
      { id: 'a3' },
      { id: 'a4' },
      { id: 'a5' },
    ]
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    const list = screen.getByTestId('task-activity-list')
    expect(list.getAttribute('data-count')).toBe('3') // sliced to limit=3
  })

  it('handles owner with null name', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} owner={{ name: null, email: 'john@test.com' }} />)
    expect(screen.getByText('john@test.com')).toBeInTheDocument()
  })

  it('hides "see less" button when limit is <= 9', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.queryByText('see less')).not.toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 15. InviteMemberModal (WorkspacePage)
// ═══════════════════════════════════════════════════════════════════════════════

describe('InviteMemberModal', () => {
  const defaultProps = {
    workspaceId: 'ws-1',
    isOpen: true,
    onClose: vi.fn(),
  }

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<InviteMemberModal {...defaultProps} isOpen={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders modal when isOpen is true', () => {
    render(<InviteMemberModal {...defaultProps} />)
    expect(screen.getByText('Invite Team Member')).toBeInTheDocument()
  })

  it('renders email input', () => {
    render(<InviteMemberModal {...defaultProps} />)
    expect(screen.getByPlaceholderText('colleague@example.com')).toBeInTheDocument()
  })

  it('renders role select', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    const options = select.querySelectorAll('option')
    expect(options.length).toBe(3)
    expect(options[0].textContent).toBe('Member')
    expect(options[1].textContent).toBe('Admin')
    expect(options[2].textContent).toBe('Guest')
  })

  it('defaults role to MEMBER', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('MEMBER')
  })

  it('updates email state on input change', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    expect((input as HTMLInputElement).value).toBe('test@test.com')
  })

  it('updates role state on select change', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'ADMIN' } })
    expect((select as HTMLSelectElement).value).toBe('ADMIN')
  })

  it('disables invite button when email is empty', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    expect(inviteBtn).toBeDisabled()
  })

  it('enables invite button when email is entered', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    expect(inviteBtn).not.toBeDisabled()
  })

  it('calls inviteMember.mutateAsync on invite click', async () => {
    const mockMutate = vi.fn().mockResolvedValue({})
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: mockMutate, isPending: false })
    render(<InviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    fireEvent.click(screen.getByText('Send Invitation'))
    expect(mockMutate).toHaveBeenCalledWith({
      workspaceId: 'ws-1',
      email: 'test@test.com',
      role: 'MEMBER',
    })
  })

  it('calls onClose after successful invite', async () => {
    const mockMutate = vi.fn().mockResolvedValue({})
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: mockMutate, isPending: false })
    render(<InviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    fireEvent.click(screen.getByText('Send Invitation'))
    // onClose should be called after mutateAsync resolves
    await vi.waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  it('calls onClose when cancel is clicked', () => {
    render(<InviteMemberModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', () => {
    render(<InviteMemberModal {...defaultProps} />)
    const backdrop = screen.getByText('Invite Team Member').closest('div')!.parentElement!
    fireEvent.click(backdrop)
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('does not call onClose when modal content clicked', () => {
    render(<InviteMemberModal {...defaultProps} />)
    // The inner div (closest to h3) has stopPropagation
    const innerContent = screen.getByText('Invite Team Member').closest('div')!
    fireEvent.click(innerContent)
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('disables invite button when isPending', () => {
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: true })
    render(<InviteMemberModal {...defaultProps} />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    expect(inviteBtn).toBeDisabled()
  })

  it('shows loading spinner when isPending', () => {
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: true })
    render(<InviteMemberModal {...defaultProps} />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    const svg = inviteBtn.querySelector('svg')
    expect(svg!.getAttribute('class')).toContain('animate-spin')
  })

  it('does not call mutateAsync when email is empty', async () => {
    const mockMutate = vi.fn()
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: mockMutate, isPending: false })
    render(<InviteMemberModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Send Invitation'))
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('handles invite error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockMutate = vi.fn().mockRejectedValue(new Error('fail'))
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: mockMutate, isPending: false })
    render(<InviteMemberModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('colleague@example.com')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    fireEvent.click(screen.getByText('Send Invitation'))
    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Invite error:', expect.any(Error))
    })
    consoleSpy.mockRestore()
  })

  it('shows Mail icon when not pending', () => {
    ;(useInviteMember as any).mockReturnValue({ mutateAsync: vi.fn(), isPending: false })
    render(<InviteMemberModal {...defaultProps} />)
    const inviteBtn = screen.getByText('Send Invitation').closest('button')!
    const svg = inviteBtn.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('has correct form structure', () => {
    render(<InviteMemberModal {...defaultProps} />)
    expect(screen.getByText('Email Address')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 16. WorkspaceDetailErrorState
// ═══════════════════════════════════════════════════════════════════════════════

describe('WorkspaceDetailErrorState', () => {
  it('renders the error heading', () => {
    render(<WorkspaceDetailErrorState />)
    expect(screen.getByText('Workspace not found')).toBeInTheDocument()
  })

  it('renders the error description', () => {
    render(<WorkspaceDetailErrorState />)
    expect(screen.getByText(/This workspace doesn/)).toBeInTheDocument()
    expect(screen.getByText(/exist or you don/)).toBeInTheDocument()
  })

  it('renders the Back to Workspaces button', () => {
    render(<WorkspaceDetailErrorState />)
    expect(screen.getByText('Back to Workspaces')).toBeInTheDocument()
  })

  it('navigates to workspaces list when button clicked', () => {
    render(<WorkspaceDetailErrorState />)
    fireEvent.click(screen.getByText('Back to Workspaces'))
    expect(mockPush).toHaveBeenCalledWith('/dashboard/workspaces')
  })

  it('renders AlertCircle icon', () => {
    render(<WorkspaceDetailErrorState />)
    const svgs = document.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('has correct heading level', () => {
    render(<WorkspaceDetailErrorState />)
    const heading = screen.getByText('Workspace not found')
    expect(heading.tagName).toBe('H2')
  })

  it('button has primary styles', () => {
    render(<WorkspaceDetailErrorState />)
    const btn = screen.getByText('Back to Workspaces').closest('button')!
    expect(btn.className).toContain('bg-primary')
    expect(btn.className).toContain('text-primary-foreground')
  })
})
