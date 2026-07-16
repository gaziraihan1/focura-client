import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RoleBadge } from '@/components/Dashboard/Workspaces/TeamPage/RoleBadge'
import { StatsCards } from '@/components/Dashboard/Workspaces/TeamPage/StatsCard'
import { EmptyState } from '@/components/Dashboard/Workspaces/TeamPage/EmptyState'
import { MemberRow } from '@/components/Dashboard/Workspaces/TeamPage/MemberRow'
import { ProjectCard } from '@/components/Dashboard/Workspaces/TeamPage/ProjectCard'
import { GeneralSettingsTab } from '@/components/Dashboard/Workspaces/WorkspaceSettings/GeneralSettingsTab'
import { DangerZoneTab } from '@/components/Dashboard/Workspaces/WorkspaceSettings/DangerZoneTab'

vi.mock('lucide-react', () => ({
  Users: (props: any) => <svg data-testid="users-icon" {...props} />,
  FolderOpen: (props: any) => <svg data-testid="folder-icon" {...props} />,
  ShieldCheck: (props: any) => <svg data-testid="shield-icon" {...props} />,
  Award: (props: any) => <svg data-testid="award-icon" {...props} />,
  ChevronDown: (props: any) => <svg data-testid="chevron-icon" {...props} />,
  CheckCircle2: (props: any) => <svg data-testid="check-icon" {...props} />,
  Circle: (props: any) => <svg data-testid="circle-icon" {...props} />,
  AlertCircle: (props: any) => <svg data-testid="alert-icon" {...props} />,
  Save: (props: any) => <svg data-testid="save-icon" {...props} />,
  Loader2: (props: any) => <svg data-testid="loader-icon" {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ workspaceSlug: 'test-ws' }),
}))

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name }: any) => <div data-testid="avatar">{name}</div>,
}))

vi.mock('@/hooks/useWorkspaceSettings', () => ({
  PREDEFINED_COLORS: ['#3b82f6', '#ef4444', '#22c55e'],
}))

describe('RoleBadge', () => {
  it('renders Owner badge', () => {
    render(<RoleBadge role="OWNER" />)
    expect(screen.getByText('Owner')).toBeInTheDocument()
  })

  it('renders Admin badge', () => {
    render(<RoleBadge role="ADMIN" />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('renders Member badge', () => {
    render(<RoleBadge role="MEMBER" />)
    expect(screen.getByText('Member')).toBeInTheDocument()
  })

  it('renders Guest badge', () => {
    render(<RoleBadge role="GUEST" />)
    expect(screen.getByText('Guest')).toBeInTheDocument()
  })

  it('renders Manager badge', () => {
    render(<RoleBadge role="MANAGER" />)
    expect(screen.getByText('Manager')).toBeInTheDocument()
  })

  it('renders Collaborator badge', () => {
    render(<RoleBadge role="COLLABORATOR" />)
    expect(screen.getByText('Collaborator')).toBeInTheDocument()
  })

  it('renders Viewer badge', () => {
    render(<RoleBadge role="VIEWER" />)
    expect(screen.getByText('Viewer')).toBeInTheDocument()
  })

  it('applies compact class when compact is true', () => {
    const { container } = render(<RoleBadge role="MEMBER" compact={true} />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('text-xs')
  })
})

describe('StatsCards', () => {
  it('renders all stat labels', () => {
    render(<StatsCards stats={{ totalMembers: 10, totalProjects: 5, adminCount: 2, managerCount: 1 }} />)
    expect(screen.getByText('Total Members')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Admins')).toBeInTheDocument()
    expect(screen.getByText('Project Managers')).toBeInTheDocument()
  })

  it('renders stat values', () => {
    render(<StatsCards stats={{ totalMembers: 10, totalProjects: 5, adminCount: 2, managerCount: 1 }} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState icon={(props: any) => <svg {...props} />} title="No members" />)
    expect(screen.getByText('No members')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState icon={(props: any) => <svg {...props} />} title="No members" description="Invite people to join" />)
    expect(screen.getByText('Invite people to join')).toBeInTheDocument()
  })

  it('hides description when not provided', () => {
    render(<EmptyState icon={(props: any) => <svg {...props} />} title="No members" />)
    expect(screen.queryByText(/Invite/)).not.toBeInTheDocument()
  })
})

describe('MemberRow', () => {
  const member = {
    id: 'm-1',
    user: { id: 'u-1', name: 'Alice', email: 'alice@test.com', image: null },
    displayName: 'Alice',
    role: 'MEMBER' as const,
    joinedAt: '2024-06-15T00:00:00Z',
  }

  it('renders member name', () => {
    render(
      <table><tbody>
        <MemberRow member={member} isCurrentUser={false} canManage={false} isOnlyOwner={false} onRoleChange={vi.fn()} />
      </tbody></table>
    )
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0)
  })

  it('renders member email', () => {
    render(
      <table><tbody>
        <MemberRow member={member} isCurrentUser={false} canManage={false} isOnlyOwner={false} onRoleChange={vi.fn()} />
      </tbody></table>
    )
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
  })

  it('shows "(you)" for current user', () => {
    render(
      <table><tbody>
        <MemberRow member={member} isCurrentUser={true} canManage={false} isOnlyOwner={false} onRoleChange={vi.fn()} />
      </tbody></table>
    )
    expect(screen.getByText('(you)')).toBeInTheDocument()
  })

  it('renders role badge when cannot manage', () => {
    render(
      <table><tbody>
        <MemberRow member={member} isCurrentUser={false} canManage={false} isOnlyOwner={false} onRoleChange={vi.fn()} />
      </tbody></table>
    )
    expect(screen.getByText('Member')).toBeInTheDocument()
  })
})

describe('ProjectCard', () => {
  const project = {
    id: 'p-1',
    name: 'Test Project',
    description: 'A test project',
    status: 'ACTIVE' as const,
    priority: 'HIGH' as const,
    color: '#3b82f6',
    taskCount: 10,
    completedTasks: 5,
    memberCount: 3,
  }

  it('renders project name', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('renders project description', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('A test project')).toBeInTheDocument()
  })

  it('renders member count', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('3 members')).toBeInTheDocument()
  })

  it('renders task count', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('10 tasks')).toBeInTheDocument()
  })

  it('renders completion percentage', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('50% complete')).toBeInTheDocument()
  })

  it('renders progress bar text', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('5/10')).toBeInTheDocument()
  })

  it('calls onToggle when header is clicked', () => {
    const onToggle = vi.fn()
    render(<ProjectCard project={project} isExpanded={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByText('Test Project').closest('button')!)
    expect(onToggle).toHaveBeenCalled()
  })

  it('renders children when expanded', () => {
    render(
      <ProjectCard project={project} isExpanded={true} onToggle={vi.fn()}>
        <p>Expanded content</p>
      </ProjectCard>
    )
    expect(screen.getByText('Expanded content')).toBeInTheDocument()
  })

  it('hides children when collapsed', () => {
    render(
      <ProjectCard project={project} isExpanded={false} onToggle={vi.fn()}>
        <p>Expanded content</p>
      </ProjectCard>
    )
    expect(screen.queryByText('Expanded content')).not.toBeInTheDocument()
  })
})

describe('GeneralSettingsTab', () => {
  const defaultProps = {
    formData: { name: 'My Workspace', description: 'Test desc', color: '#3b82f6', isPublic: false, allowInvites: true },
    errors: {},
    isAdmin: true,
    isUpdating: false,
    onUpdateField: vi.fn(),
    onSave: vi.fn(),
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders workspace name input', () => {
    render(<GeneralSettingsTab {...defaultProps} />)
    expect(screen.getByDisplayValue('My Workspace')).toBeInTheDocument()
  })

  it('renders description textarea', () => {
    render(<GeneralSettingsTab {...defaultProps} />)
    expect(screen.getByDisplayValue('Test desc')).toBeInTheDocument()
  })

  it('renders public checkbox', () => {
    render(<GeneralSettingsTab {...defaultProps} />)
    expect(screen.getByText('Public workspace')).toBeInTheDocument()
  })

  it('renders allow invites checkbox', () => {
    render(<GeneralSettingsTab {...defaultProps} />)
    expect(screen.getByText('Allow invitations')).toBeInTheDocument()
  })

  it('renders save button for admin', () => {
    render(<GeneralSettingsTab {...defaultProps} />)
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  it('hides save button for non-admin', () => {
    render(<GeneralSettingsTab {...defaultProps} isAdmin={false} />)
    expect(screen.queryByText('Save Changes')).not.toBeInTheDocument()
  })

  it('calls onUpdateField when name is changed', () => {
    render(<GeneralSettingsTab {...defaultProps} />)
    fireEvent.change(screen.getByDisplayValue('My Workspace'), { target: { value: 'New Name' } })
    expect(defaultProps.onUpdateField).toHaveBeenCalledWith('name', 'New Name')
  })

  it('renders validation error', () => {
    render(<GeneralSettingsTab {...defaultProps} errors={{ name: 'Name is required' }} />)
    expect(screen.getByText('Name is required')).toBeInTheDocument()
  })

  it('disables inputs for non-admin', () => {
    render(<GeneralSettingsTab {...defaultProps} isAdmin={false} />)
    const nameInput = screen.getByDisplayValue('My Workspace')
    expect(nameInput).toBeDisabled()
  })
})

describe('DangerZoneTab', () => {
  const defaultProps = {
    isOwner: false,
    isLeavingWorkspace: false,
    onLeaveWorkspace: vi.fn(),
    onDeleteWorkspace: vi.fn(),
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders Danger Zone heading', () => {
    render(<DangerZoneTab {...defaultProps} />)
    expect(screen.getByText('Danger Zone')).toBeInTheDocument()
  })

  it('renders irreversible warning', () => {
    render(<DangerZoneTab {...defaultProps} />)
    expect(screen.getByText(/irreversible/)).toBeInTheDocument()
  })

  it('renders Leave button for non-owner', () => {
    render(<DangerZoneTab {...defaultProps} />)
    expect(screen.getByText('Leave')).toBeInTheDocument()
  })

  it('hides Leave button for owner', () => {
    render(<DangerZoneTab {...defaultProps} isOwner={true} />)
    expect(screen.queryByText('Leave')).not.toBeInTheDocument()
  })

  it('renders Delete button for owner', () => {
    render(<DangerZoneTab {...defaultProps} isOwner={true} />)
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('hides Delete button for non-owner', () => {
    render(<DangerZoneTab {...defaultProps} />)
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('calls onLeaveWorkspace when Leave is clicked', () => {
    render(<DangerZoneTab {...defaultProps} />)
    fireEvent.click(screen.getByText('Leave'))
    expect(defaultProps.onLeaveWorkspace).toHaveBeenCalled()
  })

  it('calls onDeleteWorkspace when Delete is clicked', () => {
    render(<DangerZoneTab {...defaultProps} isOwner={true} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(defaultProps.onDeleteWorkspace).toHaveBeenCalled()
  })
})
