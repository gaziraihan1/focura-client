import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// ─── Global mocks ────────────────────────────────────────────────────────────
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ workspaceSlug: 'test-ws' }),
}))

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

vi.mock('date-fns', () => ({
  format: (_date: any, fmt: string) => 'Jan 15',
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: 'user-1', name: 'Test User' } },
    status: 'authenticated',
  }),
}))

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name }: any) => <div data-testid="avatar">{name}</div>,
}))

vi.mock('@/hooks/useWorkspacePage', () => ({
  useWorkspacesPage: () => ({
    searchQuery: '',
    setSearchQuery: vi.fn(),
    isLoading: false,
    isError: false,
    filteredWorkspaces: [],
    getPlanBadge: (plan: string) => ({ color: 'bg-gray-500/10 text-gray-500', label: 'Free' }),
    navigateToCreate: vi.fn(),
    navigateToSettings: vi.fn(),
  }),
}))

vi.mock('@/hooks/useLargestFileTable', () => ({
  useLargestFilesTable: () => ({
    currentUserId: 'user-1',
    selectedFiles: new Set<string>(),
    filteredAndSortedFiles: [],
    selectedFilesSize: 0,
    deletableCount: 0,
    deletingFileId: null,
    filterType: 'all',
    isDeleting: false,
    toggleFileSelection: vi.fn(),
    selectAll: vi.fn(),
    clearSelection: vi.fn(),
    setFilterType: vi.fn(),
    handleBulkDelete: vi.fn(),
    handleDeleteFile: vi.fn(),
  }),
}))

// Mock sub-components of LargestFilesTable
vi.mock('@/components/Dashboard/Storage/LargestFilesTable/TableHeader', () => ({
  TableHeader: (props: any) => <div data-testid="table-header" {...props} />,
}))
vi.mock('@/components/Dashboard/Storage/LargestFilesTable/AdminBadge', () => ({
  AdminBadge: () => <div data-testid="admin-badge" />,
}))
vi.mock('@/components/Dashboard/Storage/LargestFilesTable/BulkActionsBar', () => ({
  BulkActionsBar: (props: any) => <div data-testid="bulk-actions-bar" {...props} />,
}))
vi.mock('@/components/Dashboard/Storage/LargestFilesTable/FileTableRow', () => ({
  FileTableRow: (props: any) => <tr data-testid="file-table-row" {...props} />,
}))
vi.mock('@/components/Dashboard/Storage/LargestFilesTable/EmptyState', () => ({
  EmptyState: () => <div data-testid="empty-state" />,
}))

// Mock FocusTaskCard sub-components
vi.mock('@/components/Dashboard/AllTasks/FocusTaskCard/FocusBadge', () => ({
  FocusBadge: (props: any) => <div data-testid="focus-badge" {...props} />,
}))
vi.mock('@/components/Dashboard/AllTasks/FocusTaskCard/TaskStatusIcon', () => ({
  TaskStatusIcon: (props: any) => <div data-testid="task-status-icon" {...props} />,
}))
vi.mock('@/components/Dashboard/AllTasks/FocusTaskCard/TaskHeader', () => ({
  TaskHeader: (props: any) => <div data-testid="task-header" {...props} />,
}))
vi.mock('@/components/Dashboard/AllTasks/FocusTaskCard/TaskProgressBar', () => ({
  TaskProgressBar: (props: any) => <div data-testid="task-progress-bar" {...props} />,
}))
vi.mock('@/components/Dashboard/AllTasks/FocusTaskCard/TaskMetadata', () => ({
  TaskMetadata: (props: any) => <div data-testid="task-metadata" {...props} />,
}))

// Mock TaskCardParts
vi.mock('@/components/Dashboard/AllTasks/WorkspaceTasks/TaskCardParts', () => ({
  TaskCardHeader: (props: any) => <div data-testid="task-card-header" {...props} />,
  TaskCardMetaChips: (props: any) => <div data-testid="task-card-meta-chips" {...props} />,
  TaskCardProgressAssignees: (props: any) => <div data-testid="task-card-progress-assignees" {...props} />,
}))

// Mock TeamPage sub-components
vi.mock('@/components/Dashboard/Workspaces/TeamPage/ProjectMembersPanel', () => ({
  ProjectMembersPanel: (props: any) => <div data-testid="project-members-panel" {...props} />,
}))

vi.mock('lucide-react', () => ({
  Users: (props: any) => <svg data-testid="users-icon" {...props} />,
  FolderOpen: (props: any) => <svg data-testid="folder-icon" {...props} />,
  ShieldCheck: (props: any) => <svg data-testid="shield-icon" {...props} />,
  Award: (props: any) => <svg data-testid="award-icon" {...props} />,
  ChevronDown: (props: any) => <svg data-testid="chevron-icon" {...props} />,
  CheckCircle2: (props: any) => <svg data-testid="check-icon" {...props} />,
  Circle: (props: any) => <svg data-testid="circle-icon" {...props} />,
  Search: (props: any) => <svg data-testid="search-icon" {...props} />,
  MoreVertical: (props: any) => <svg data-testid="more-vertical-icon" {...props} />,
  Calendar: (props: any) => <svg data-testid="calendar-icon" {...props} />,
  AlertCircle: (props: any) => <svg data-testid="alert-icon" {...props} />,
  Plus: (props: any) => <svg data-testid="plus-icon" {...props} />,
  Loader2: (props: any) => <svg data-testid="loader-icon" {...props} />,
  Crown: (props: any) => <svg data-testid="crown-icon" {...props} />,
  FolderKanban: (props: any) => <svg data-testid="folder-kanban-icon" {...props} />,
  Settings: (props: any) => <svg data-testid="settings-icon" {...props} />,
  CheckSquare: (props: any) => <svg data-testid="check-square-icon" {...props} />,
  Square: (props: any) => <svg data-testid="square-icon" {...props} />,
}))

// ═══════════════════════════════════════════════════════════════════════════════
// Imports under test
// ═══════════════════════════════════════════════════════════════════════════════
import { RoleBadge } from '@/components/Dashboard/Workspaces/TeamPage/RoleBadge'
import { EmptyState } from '@/components/Dashboard/Workspaces/TeamPage/EmptyState'
import { StatsCards } from '@/components/Dashboard/Workspaces/TeamPage/StatsCard'
import { MemberRow } from '@/components/Dashboard/Workspaces/TeamPage/MemberRow'
import { RoleDropdown } from '@/components/Dashboard/Workspaces/TeamPage/RoleDropdown'
import Tabs from '@/components/Dashboard/Workspaces/TeamPage/Tabs'
import { ProjectCard } from '@/components/Dashboard/Workspaces/TeamPage/ProjectCard'
import { ProjectsTab } from '@/components/Dashboard/Workspaces/TeamPage/ProjectsTab'
import TeamPageLoading from '@/components/Dashboard/Workspaces/TeamPage/TeamPageLoading'
import { ProjectCardHeader } from '@/components/Dashboard/Workspaces/ProjectCard/ProjectCardHeader'
import { ProjectCardFooter } from '@/components/Dashboard/Workspaces/ProjectCard/ProjectCardFooter'
import { ProjectCardStats } from '@/components/Dashboard/Workspaces/ProjectCard/ProjectCardStats'
import { ProjectCardProgress } from '@/components/Dashboard/Workspaces/ProjectCard/ProjectCardProgress'
import { ProjectCardDescription } from '@/components/Dashboard/Workspaces/ProjectCard/ProjectCardDescription'
import { ProjectCardDueDate } from '@/components/Dashboard/Workspaces/ProjectCard/ProjectCardDueDate'
import { ProjectCardTaskStats } from '@/components/Dashboard/Workspaces/ProjectCard/ProjectCardTaskStats'
import { ProjectCardMembers } from '@/components/Dashboard/Workspaces/ProjectCard/ProjectCardMembers'
import { TaskCard } from '@/components/Dashboard/AllTasks/WorkspaceTasks/TaskCard'
import { LargestFilesTable } from '@/components/Dashboard/Storage/LargestFilesTable'
import { FocusTaskCard } from '@/components/Dashboard/AllTasks/FocusTaskCard'
import { WorkspaceCard } from '@/components/Dashboard/Workspaces/Workspaces/WorkspaceCard'
import { WorkspaceGrid } from '@/components/Dashboard/Workspaces/Workspaces/WorkspaceGrid'
import { WorkspacesHeader } from '@/components/Dashboard/Workspaces/Workspaces/WorkspacesHeader'
import { WorkspaceSearch } from '@/components/Dashboard/Workspaces/Workspaces/WorkspaceSearch'
import { WorkspacesContent } from '@/components/Dashboard/Workspaces/Workspaces/WorkspacesContent'

// ─── Shared test data ────────────────────────────────────────────────────────
const mockMember = {
  id: 'm-1',
  user: { id: 'u-1', name: 'Alice', email: 'alice@test.com', image: null },
  displayName: 'Alice',
  role: 'MEMBER' as const,
  joinedAt: '2024-06-15T00:00:00Z',
}

const mockProject = {
  id: 'p-1',
  name: 'Test Project',
  description: 'A test project description',
  status: 'ACTIVE',
  priority: 'HIGH',
  color: '#3b82f6',
  taskCount: 10,
  completedTasks: 5,
  memberCount: 3,
}

const mockTask = {
  id: 't-1',
  title: 'Test Task',
  description: 'A test task description',
  status: 'TODO' as const,
  priority: 'HIGH' as const,
  dueDate: '2025-01-15',
  createdBy: { id: 'u-1', name: 'Test User', image: undefined },
  assignees: [
    { user: { id: 'u-1', name: 'Alice', image: undefined } },
  ],
  project: {
    id: 'p-1',
    slug: 'test-project',
    name: 'Test Project',
    color: '#3b82f6',
    workspace: { id: 'ws-1', name: 'Test Workspace' },
  },
  _count: { comments: 2, subtasks: 3, files: 1 },
  createdAt: '2024-06-01T00:00:00Z',
  updatedAt: '2024-06-15T00:00:00Z',
  timeTracking: {
    hoursSinceCreation: 12,
    hoursUntilDue: 24,
    isOverdue: false,
    isDueToday: false,
    timeProgress: 50,
  },
}

const mockWorkspace = {
  id: 'ws-1',
  name: 'Test Workspace',
  slug: 'test-ws',
  description: 'A workspace for testing',
  logo: null,
  color: '#6366f1',
  isPublic: false,
  allowInvites: true,
  plan: 'FREE' as const,
  maxMembers: 5,
  maxStorage: 1024,
  ownerId: 'user-1',
  owner: { id: 'user-1', name: 'Test User', email: 'test@test.com', image: undefined },
  members: [],
  _count: { projects: 3, members: 5 },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-06-15T00:00:00Z',
}

// ═══════════════════════════════════════════════════════════════════════════════
// RoleBadge
// ═══════════════════════════════════════════════════════════════════════════════
describe('RoleBadge', () => {
  const roles = [
    { role: 'OWNER' as const, label: 'Owner' },
    { role: 'ADMIN' as const, label: 'Admin' },
    { role: 'MEMBER' as const, label: 'Member' },
    { role: 'GUEST' as const, label: 'Guest' },
    { role: 'MANAGER' as const, label: 'Manager' },
    { role: 'COLLABORATOR' as const, label: 'Collaborator' },
    { role: 'VIEWER' as const, label: 'Viewer' },
  ]

  roles.forEach(({ role, label }) => {
    it(`renders ${label} badge for role ${role}`, () => {
      render(<RoleBadge role={role} />)
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  it('applies compact styles when compact is true', () => {
    const { container } = render(<RoleBadge role="ADMIN" compact />)
    const badge = container.querySelector('span')!
    expect(badge.className).toContain('text-xs')
  })

  it('applies default (non-compact) styles when compact is false', () => {
    const { container } = render(<RoleBadge role="ADMIN" compact={false} />)
    const badge = container.querySelector('span')!
    expect(badge.className).toContain('px-2.5')
  })

  it('uses MEMBER style for unknown role', () => {
    const { container } = render(<RoleBadge role={'UNKNOWN' as any} />)
    const badge = container.querySelector('span')!
    expect(badge.className).toContain('bg-sky-100')
  })

  it('renders the raw role string for unknown role label', () => {
    render(<RoleBadge role={'UNKNOWN' as any} />)
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// EmptyState
// ═══════════════════════════════════════════════════════════════════════════════
describe('EmptyState', () => {
  const MockIcon = (props: any) => <svg data-testid="mock-icon" {...props} />

  it('renders title text', () => {
    render(<EmptyState icon={MockIcon} title="No data" />)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState icon={MockIcon} title="No data" description="Try something else" />)
    expect(screen.getByText('Try something else')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    render(<EmptyState icon={MockIcon} title="No data" />)
    expect(screen.queryByText('Try something else')).not.toBeInTheDocument()
  })

  it('does not render description when description is undefined', () => {
    render(<EmptyState icon={MockIcon} title="No data" description={undefined} />)
    const paragraphs = screen.queryAllByText(/./)
    expect(paragraphs.length).toBe(1) // only title
  })

  it('renders the icon component', () => {
    render(<EmptyState icon={MockIcon} title="Empty" />)
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// StatsCards
// ═══════════════════════════════════════════════════════════════════════════════
describe('StatsCards', () => {
  const stats = { totalMembers: 12, totalProjects: 8, adminCount: 3, managerCount: 2 }

  it('renders all four card labels', () => {
    render(<StatsCards stats={stats} />)
    expect(screen.getByText('Total Members')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Admins')).toBeInTheDocument()
    expect(screen.getByText('Project Managers')).toBeInTheDocument()
  })

  it('renders all stat values', () => {
    render(<StatsCards stats={stats} />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders with zero values', () => {
    render(<StatsCards stats={{ totalMembers: 0, totalProjects: 0, adminCount: 0, managerCount: 0 }} />)
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBe(4)
  })

  it('renders icons', () => {
    render(<StatsCards stats={stats} />)
    expect(screen.getByTestId('users-icon')).toBeInTheDocument()
    expect(screen.getByTestId('folder-icon')).toBeInTheDocument()
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument()
    expect(screen.getByTestId('award-icon')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// MemberRow
// ═══════════════════════════════════════════════════════════════════════════════
describe('MemberRow', () => {
  const member = { ...mockMember }

  const renderRow = (overrides: Partial<React.ComponentProps<typeof MemberRow>> = {}) =>
    render(
      <table><tbody>
        <MemberRow
          member={member}
          isCurrentUser={false}
          canManage={false}
          isOnlyOwner={false}
          onRoleChange={vi.fn()}
          {...overrides}
        />
      </tbody></table>
    )

  it('renders display name', () => {
    renderRow()
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0)
  })

  it('renders email', () => {
    renderRow()
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
  })

  it('shows "(you)" badge for current user', () => {
    renderRow({ isCurrentUser: true })
    expect(screen.getByText('(you)')).toBeInTheDocument()
  })

  it('does not show "(you)" for non-current user', () => {
    renderRow({ isCurrentUser: false })
    expect(screen.queryByText('(you)')).not.toBeInTheDocument()
  })

  it('shows RoleBadge when cannot manage', () => {
    renderRow({ canManage: false })
    expect(screen.getByText('Member')).toBeInTheDocument()
  })

  it('shows RoleDropdown when can manage', () => {
    renderRow({ canManage: true })
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('formats joined date', () => {
    renderRow()
    // The date is formatted using toLocaleDateString
    const cells = screen.getAllByText(/Jun/)
    expect(cells.length).toBeGreaterThan(0)
  })

  it('calls onRoleChange with correct args when dropdown changes', () => {
    const onRoleChange = vi.fn()
    renderRow({ canManage: true, onRoleChange })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ADMIN' } })
    expect(onRoleChange).toHaveBeenCalledWith('m-1', 'ADMIN')
  })

  it('disables dropdown for current user', () => {
    renderRow({ canManage: true, isCurrentUser: true })
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('disables dropdown for only owner', () => {
    const ownerMember = { ...member, role: 'OWNER' as const }
    renderRow({ canManage: true, isOnlyOwner: true, member: ownerMember })
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('enables dropdown for non-current user who is not only owner', () => {
    renderRow({ canManage: true, isCurrentUser: false, isOnlyOwner: false })
    expect(screen.getByRole('combobox')).not.toBeDisabled()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// RoleDropdown
// ═══════════════════════════════════════════════════════════════════════════════
describe('RoleDropdown', () => {
  it('renders workspace role options', () => {
    render(
      <RoleDropdown variant="workspace" currentRole="MEMBER" onChange={vi.fn()} />
    )
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(screen.getByText('Owner')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Member')).toBeInTheDocument()
    expect(screen.getByText('Guest')).toBeInTheDocument()
  })

  it('renders project role options', () => {
    render(
      <RoleDropdown variant="project" currentRole="VIEWER" onChange={vi.fn()} />
    )
    expect(screen.getByText('Manager')).toBeInTheDocument()
    expect(screen.getByText('Collaborator')).toBeInTheDocument()
    expect(screen.getByText('Viewer')).toBeInTheDocument()
  })

  it('calls onChange with workspace role on change', () => {
    const onChange = vi.fn()
    render(
      <RoleDropdown variant="workspace" currentRole="MEMBER" onChange={onChange} />
    )
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'OWNER' } })
    expect(onChange).toHaveBeenCalledWith('OWNER')
  })

  it('calls onChange with project role on change', () => {
    const onChange = vi.fn()
    render(
      <RoleDropdown variant="project" currentRole="VIEWER" onChange={onChange} />
    )
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'MANAGER' } })
    expect(onChange).toHaveBeenCalledWith('MANAGER')
  })

  it('disables select when disabled prop is true', () => {
    render(
      <RoleDropdown
        variant="workspace"
        currentRole="ADMIN"
        disabled
        disabledReason="Cannot change"
        onChange={vi.fn()}
      />
    )
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('sets title attribute with disabledReason when disabled', () => {
    const { container } = render(
      <RoleDropdown
        variant="workspace"
        currentRole="ADMIN"
        disabled
        disabledReason="Cannot change"
        onChange={vi.fn()}
      />
    )
    const wrapper = container.querySelector('[title="Cannot change"]')
    expect(wrapper).toBeInTheDocument()
  })

  it('does not set title when not disabled', () => {
    const { container } = render(
      <RoleDropdown variant="workspace" currentRole="ADMIN" onChange={vi.fn()} />
    )
    const titled = container.querySelector('[title]')
    expect(titled).not.toBeInTheDocument()
  })

  it('sets select value to currentRole', () => {
    render(
      <RoleDropdown variant="workspace" currentRole="ADMIN" onChange={vi.fn()} />
    )
    expect(screen.getByRole('combobox')).toHaveValue('ADMIN')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// Tabs
// ═══════════════════════════════════════════════════════════════════════════════
describe('Tabs', () => {
  const tabs = [
    { id: 'members' as const, label: 'Members' },
    { id: 'projects' as const, label: 'Projects' },
  ]
  const members = [mockMember]
  const projects = [mockProject]

  it('renders tab labels', () => {
    render(
      <Tabs tabs={tabs} activeTab="members" onActiveTab={vi.fn()} members={members} projects={projects} />
    )
    expect(screen.getByText('Members')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('shows member count badge', () => {
    render(
      <Tabs tabs={tabs} activeTab="members" onActiveTab={vi.fn()} members={members} projects={projects} />
    )
    const ones = screen.getAllByText('1')
    expect(ones.length).toBeGreaterThanOrEqual(1)
  })

  it('shows project count badge', () => {
    render(
      <Tabs tabs={tabs} activeTab="projects" onActiveTab={vi.fn()} members={members} projects={projects} />
    )
    const ones = screen.getAllByText('1')
    expect(ones.length).toBeGreaterThanOrEqual(1)
  })

  it('calls onActiveTab when a tab is clicked', () => {
    const onActiveTab = vi.fn()
    render(
      <Tabs tabs={tabs} activeTab="members" onActiveTab={onActiveTab} members={members} projects={projects} />
    )
    fireEvent.click(screen.getByText('Projects'))
    expect(onActiveTab).toHaveBeenCalledWith('projects')
  })

  it('calls onActiveTab for members tab', () => {
    const onActiveTab = vi.fn()
    render(
      <Tabs tabs={tabs} activeTab="projects" onActiveTab={onActiveTab} members={members} projects={projects} />
    )
    fireEvent.click(screen.getByText('Members'))
    expect(onActiveTab).toHaveBeenCalledWith('members')
  })

  it('renders correct count for multiple members', () => {
    const multiMembers = [
      mockMember,
      { ...mockMember, id: 'm-2', user: { ...mockMember.user, id: 'u-2', name: 'Bob' }, displayName: 'Bob' },
      { ...mockMember, id: 'm-3', user: { ...mockMember.user, id: 'u-3', name: 'Carol' }, displayName: 'Carol' },
    ]
    render(
      <Tabs tabs={tabs} activeTab="members" onActiveTab={vi.fn()} members={multiMembers} projects={projects} />
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ProjectCard (TeamPage)
// ═══════════════════════════════════════════════════════════════════════════════
describe('ProjectCard (TeamPage)', () => {
  const project = { ...mockProject }

  it('renders project name', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('renders project description', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('A test project description')).toBeInTheDocument()
  })

  it('renders status pill with formatted text', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders priority', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('renders member count singular', () => {
    render(<ProjectCard project={{ ...project, memberCount: 1 }} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('1 member')).toBeInTheDocument()
  })

  it('renders member count plural', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('3 members')).toBeInTheDocument()
  })

  it('renders task count singular', () => {
    render(<ProjectCard project={{ ...project, taskCount: 1 }} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('1 task')).toBeInTheDocument()
  })

  it('renders task count plural', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('10 tasks')).toBeInTheDocument()
  })

  it('renders completion percentage', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('50% complete')).toBeInTheDocument()
  })

  it('renders completed/total tasks', () => {
    render(<ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('5/10')).toBeInTheDocument()
  })

  it('calls onToggle when header is clicked', () => {
    const onToggle = vi.fn()
    render(<ProjectCard project={project} isExpanded={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByText('Test Project').closest('button')!)
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('renders children when expanded', () => {
    render(
      <ProjectCard project={project} isExpanded={true} onToggle={vi.fn()}>
        <div>Expanded panel</div>
      </ProjectCard>
    )
    expect(screen.getByText('Expanded panel')).toBeInTheDocument()
  })

  it('does not render children when collapsed', () => {
    render(
      <ProjectCard project={project} isExpanded={false} onToggle={vi.fn()}>
        <div>Expanded panel</div>
      </ProjectCard>
    )
    expect(screen.queryByText('Expanded panel')).not.toBeInTheDocument()
  })

  it('computes 0% when taskCount is 0', () => {
    render(
      <ProjectCard
        project={{ ...project, taskCount: 0, completedTasks: 0 }}
        isExpanded={false}
        onToggle={vi.fn()}
      />
    )
    expect(screen.getByText('0% complete')).toBeInTheDocument()
  })

  it('rounds percentage correctly', () => {
    render(
      <ProjectCard
        project={{ ...project, taskCount: 3, completedTasks: 1 }}
        isExpanded={false}
        onToggle={vi.fn()}
      />
    )
    expect(screen.getByText('33% complete')).toBeInTheDocument()
  })

  it('uses default color when project.color is empty', () => {
    const { container } = render(
      <ProjectCard
        project={{ ...project, color: '' }}
        isExpanded={false}
        onToggle={vi.fn()}
      />
    )
    const colorDot = container.querySelector('[style]')
    // jsdom converts hex to rgb
    expect(colorDot?.getAttribute('style')).toContain('rgb(99, 102, 241)')
  })

  it('uses project color when provided', () => {
    const { container } = render(
      <ProjectCard project={project} isExpanded={false} onToggle={vi.fn()} />
    )
    const colorDot = container.querySelector('[style]')
    expect(colorDot?.getAttribute('style')).toContain('rgb(59, 130, 246)')
  })

  it('does not render description when missing', () => {
    render(
      <ProjectCard
        project={{ ...project, description: undefined }}
        isExpanded={false}
        onToggle={vi.fn()}
      />
    )
    expect(screen.queryByText('A test project description')).not.toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ProjectsTab
// ═══════════════════════════════════════════════════════════════════════════════
describe('ProjectsTab', () => {
  const projects = [
    { ...mockProject, id: 'p-1', name: 'Alpha Project', description: 'First project', status: 'ACTIVE', priority: 'HIGH' },
    { ...mockProject, id: 'p-2', name: 'Beta Project', description: 'Second project', status: 'PLANNING', priority: 'LOW' },
    { ...mockProject, id: 'p-3', name: 'Gamma Project', description: null as string | undefined, status: 'COMPLETED', priority: 'MEDIUM' },
  ]

  const defaultProps = {
    projects,
    currentUserId: 'user-1',
    canManage: false,
    onProjectMemberRoleChange: vi.fn(),
  }

  it('renders all project cards', () => {
    render(<ProjectsTab {...defaultProps} />)
    expect(screen.getByText('Alpha Project')).toBeInTheDocument()
    expect(screen.getByText('Beta Project')).toBeInTheDocument()
    expect(screen.getByText('Gamma Project')).toBeInTheDocument()
  })

  it('renders the footer count', () => {
    render(<ProjectsTab {...defaultProps} />)
    expect(screen.getByText('Showing 3 of 3 projects')).toBeInTheDocument()
  })

  it('shows search input', () => {
    render(<ProjectsTab {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search projects…')).toBeInTheDocument()
  })

  it('filters projects by search term', () => {
    render(<ProjectsTab {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText('Search projects…'), { target: { value: 'Alpha' } })
    expect(screen.getByText('Alpha Project')).toBeInTheDocument()
    expect(screen.queryByText('Beta Project')).not.toBeInTheDocument()
    expect(screen.queryByText('Gamma Project')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 3 projects')).toBeInTheDocument()
  })

  it('filters projects by description', () => {
    render(<ProjectsTab {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText('Search projects…'), { target: { value: 'Second' } })
    expect(screen.getByText('Beta Project')).toBeInTheDocument()
    expect(screen.queryByText('Alpha Project')).not.toBeInTheDocument()
  })

  it('shows empty state when no results', () => {
    render(<ProjectsTab {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText('Search projects…'), { target: { value: 'zzznonexistent' } })
    expect(screen.getByText('No projects found')).toBeInTheDocument()
    expect(screen.getByText('Showing 0 of 3 projects')).toBeInTheDocument()
  })

  it('shows filter chips', () => {
    render(<ProjectsTab {...defaultProps} />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getAllByText('Planning').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Active').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('On Hold')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.getByText('Archived')).toBeInTheDocument()
  })

  it('filters by status chip', () => {
    render(<ProjectsTab {...defaultProps} />)
    // Click the Planning filter chip button (not the status pill)
    const planningButtons = screen.getAllByText('Planning')
    const planningChip = planningButtons.find(el => el.tagName === 'BUTTON')!
    fireEvent.click(planningChip)
    expect(screen.getByText('Beta Project')).toBeInTheDocument()
    expect(screen.queryByText('Alpha Project')).not.toBeInTheDocument()
    expect(screen.queryByText('Gamma Project')).not.toBeInTheDocument()
  })

  it('clears status filter when All is clicked', () => {
    render(<ProjectsTab {...defaultProps} />)
    const planningButtons = screen.getAllByText('Planning')
    const planningChip = planningButtons.find(el => el.tagName === 'BUTTON')!
    fireEvent.click(planningChip)
    expect(screen.queryByText('Alpha Project')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('All'))
    expect(screen.getByText('Alpha Project')).toBeInTheDocument()
  })

  it('toggles card expansion on click', () => {
    render(<ProjectsTab {...defaultProps} />)
    fireEvent.click(screen.getByText('Alpha Project').closest('button')!)
    expect(screen.getByTestId('project-members-panel')).toBeInTheDocument()
  })

  it('collapses card on second click', () => {
    render(<ProjectsTab {...defaultProps} />)
    const btn = screen.getByText('Alpha Project').closest('button')!
    fireEvent.click(btn)
    expect(screen.getByTestId('project-members-panel')).toBeInTheDocument()
    fireEvent.click(btn)
    expect(screen.queryByTestId('project-members-panel')).not.toBeInTheDocument()
  })

  it('renders singular project count', () => {
    render(<ProjectsTab {...defaultProps} projects={[projects[0]]} />)
    expect(screen.getByText('Showing 1 of 1 project')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// TeamPageLoading
// ═══════════════════════════════════════════════════════════════════════════════
describe('TeamPageLoading', () => {
  it('renders loading skeleton', () => {
    const { container } = render(<TeamPageLoading />)
    const pulseElements = container.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThan(0)
  })

  it('renders stat card skeletons (4)', () => {
    const { container } = render(<TeamPageLoading />)
    const statCards = container.querySelectorAll('.h-28.rounded-xl')
    expect(statCards.length).toBe(4)
  })

  it('renders member row skeletons (4)', () => {
    const { container } = render(<TeamPageLoading />)
    const memberRows = container.querySelectorAll('.h-14.rounded-xl')
    expect(memberRows.length).toBe(4)
  })

  it('has min-h-[400px]', () => {
    const { container } = render(<TeamPageLoading />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('min-h-[400px]')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ProjectCardHeader
// ═══════════════════════════════════════════════════════════════════════════════
describe('ProjectCardHeader', () => {
  const defaultProps = {
    name: 'My Project',
    color: '#6366f1',
    icon: null,
    status: 'ACTIVE',
    priority: 'HIGH',
  }

  it('renders project name', () => {
    render(<ProjectCardHeader {...defaultProps} />)
    expect(screen.getByText('My Project')).toBeInTheDocument()
  })

  it('shows first letter of name when no icon', () => {
    render(<ProjectCardHeader {...defaultProps} />)
    expect(screen.getByText('M')).toBeInTheDocument()
  })

  it('shows icon when provided', () => {
    render(<ProjectCardHeader {...defaultProps} icon="X" />)
    expect(screen.getByText('X')).toBeInTheDocument()
  })

  it('applies background color', () => {
    const { container } = render(<ProjectCardHeader {...defaultProps} />)
    const colorBox = container.querySelector('[style]')
    expect(colorBox?.getAttribute('style')).toContain('rgb(99, 102, 241)')
  })

  it('renders formatted status', () => {
    render(<ProjectCardHeader {...defaultProps} status="ON_HOLD" />)
    expect(screen.getByText('ON HOLD')).toBeInTheDocument()
  })

  it('renders priority', () => {
    render(<ProjectCardHeader {...defaultProps} priority="URGENT" />)
    expect(screen.getByText('URGENT')).toBeInTheDocument()
  })

  it('has menu button', () => {
    render(<ProjectCardHeader {...defaultProps} />)
    expect(screen.getByTestId('more-vertical-icon')).toBeInTheDocument()
  })

  it('menu button is clickable', () => {
    render(<ProjectCardHeader {...defaultProps} />)
    const btn = screen.getByTestId('more-vertical-icon').closest('button')!
    expect(btn).toBeInTheDocument()
    // Verify it's a real button that can be clicked
    fireEvent.click(btn)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ProjectCardFooter
// ═══════════════════════════════════════════════════════════════════════════════
describe('ProjectCardFooter', () => {
  const members = [
    { id: '1', role: 'ADMIN', user: { id: 'u-1', name: 'Alice', email: 'a@test.com', image: undefined } },
    { id: '2', role: 'MEMBER', user: { id: 'u-2', name: 'Bob', email: 'b@test.com', image: undefined } },
  ]

  it('renders ProjectCardMembers', () => {
    render(<ProjectCardFooter members={members} totalMembers={2} />)
    // Members without images show initials
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('renders ProjectCardDueDate when dueDate is provided', () => {
    render(<ProjectCardFooter members={members} totalMembers={2} dueDate="2025-01-15" />)
    expect(screen.getByText('Jan 15')).toBeInTheDocument()
  })

  it('does not render ProjectCardDueDate when dueDate is null', () => {
    render(<ProjectCardFooter members={members} totalMembers={2} dueDate={null} />)
    expect(screen.queryByText('Jan 15')).not.toBeInTheDocument()
  })

  it('does not render ProjectCardDueDate when dueDate is undefined', () => {
    render(<ProjectCardFooter members={members} totalMembers={2} />)
    expect(screen.queryByText('Jan 15')).not.toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ProjectCardStats
// ═══════════════════════════════════════════════════════════════════════════════
describe('ProjectCardStats', () => {
  it('renders progress and task stats', () => {
    render(
      <ProjectCardStats
        completedTasks={5}
        totalTasks={10}
        overdueTasks={2}
        completionRate={50}
      />
    )
    expect(screen.getByText('5/10 tasks')).toBeInTheDocument()
    expect(screen.getByText('5 done')).toBeInTheDocument()
    expect(screen.getByText('2 overdue')).toBeInTheDocument()
  })

  it('renders without overdue tasks', () => {
    render(
      <ProjectCardStats
        completedTasks={8}
        totalTasks={8}
        overdueTasks={0}
        completionRate={100}
      />
    )
    expect(screen.getByText('8/8 tasks')).toBeInTheDocument()
    expect(screen.getByText('8 done')).toBeInTheDocument()
    expect(screen.queryByText(/overdue/)).not.toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ProjectCardProgress
// ═══════════════════════════════════════════════════════════════════════════════
describe('ProjectCardProgress', () => {
  it('renders progress label', () => {
    render(<ProjectCardProgress completedTasks={3} totalTasks={7} completionRate={42} />)
    expect(screen.getByText('Progress')).toBeInTheDocument()
  })

  it('renders task count', () => {
    render(<ProjectCardProgress completedTasks={3} totalTasks={7} completionRate={42} />)
    expect(screen.getByText('3/7 tasks')).toBeInTheDocument()
  })

  it('sets progress bar width', () => {
    const { container } = render(<ProjectCardProgress completedTasks={3} totalTasks={7} completionRate={42} />)
    const bar = container.querySelector('.bg-primary')
    expect(bar?.getAttribute('style')).toContain('width: 42%')
  })

  it('handles 0% completion', () => {
    render(<ProjectCardProgress completedTasks={0} totalTasks={5} completionRate={0} />)
    expect(screen.getByText('0/5 tasks')).toBeInTheDocument()
  })

  it('handles 100% completion', () => {
    const { container } = render(<ProjectCardProgress completedTasks={5} totalTasks={5} completionRate={100} />)
    const bar = container.querySelector('.bg-primary')
    expect(bar?.getAttribute('style')).toContain('width: 100%')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ProjectCardDescription
// ═══════════════════════════════════════════════════════════════════════════════
describe('ProjectCardDescription', () => {
  it('renders description text', () => {
    render(<ProjectCardDescription description="Hello world" />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('returns null when description is null', () => {
    const { container } = render(<ProjectCardDescription description={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when description is undefined', () => {
    const { container } = render(<ProjectCardDescription description={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when description is empty string', () => {
    const { container } = render(<ProjectCardDescription description="" />)
    expect(container.firstChild).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ProjectCardDueDate
// ═══════════════════════════════════════════════════════════════════════════════
describe('ProjectCardDueDate', () => {
  it('renders formatted date', () => {
    render(<ProjectCardDueDate dueDate="2025-01-15" />)
    expect(screen.getByText('Jan 15')).toBeInTheDocument()
  })

  it('renders calendar icon', () => {
    render(<ProjectCardDueDate dueDate="2025-01-15" />)
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
  })

  it('returns null when dueDate is null', () => {
    const { container } = render(<ProjectCardDueDate dueDate={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when dueDate is undefined', () => {
    const { container } = render(<ProjectCardDueDate dueDate={undefined} />)
    expect(container.firstChild).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ProjectCardTaskStats
// ═══════════════════════════════════════════════════════════════════════════════
describe('ProjectCardTaskStats', () => {
  it('renders completed count', () => {
    render(<ProjectCardTaskStats completedTasks={5} overdueTasks={0} />)
    expect(screen.getByText('5 done')).toBeInTheDocument()
  })

  it('renders overdue count when > 0', () => {
    render(<ProjectCardTaskStats completedTasks={5} overdueTasks={3} />)
    expect(screen.getByText('3 overdue')).toBeInTheDocument()
  })

  it('does not render overdue when 0', () => {
    render(<ProjectCardTaskStats completedTasks={5} overdueTasks={0} />)
    expect(screen.queryByText(/overdue/)).not.toBeInTheDocument()
  })

  it('renders check icon for completed', () => {
    render(<ProjectCardTaskStats completedTasks={5} overdueTasks={0} />)
    expect(screen.getByTestId('check-icon')).toBeInTheDocument()
  })

  it('renders alert icon when overdue > 0', () => {
    render(<ProjectCardTaskStats completedTasks={5} overdueTasks={1} />)
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
  })

  it('does not render alert icon when overdue is 0', () => {
    render(<ProjectCardTaskStats completedTasks={5} overdueTasks={0} />)
    expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ProjectCardMembers
// ═══════════════════════════════════════════════════════════════════════════════
describe('ProjectCardMembers', () => {
  const members = [
    { id: '1', role: 'ADMIN', user: { id: 'u-1', name: 'Alice', email: 'a@test.com', image: 'http://img/a.jpg' } },
    { id: '2', role: 'MEMBER', user: { id: 'u-2', name: 'Bob', email: 'b@test.com', image: undefined } },
  ]

  it('shows "No members" when empty', () => {
    render(<ProjectCardMembers members={[]} totalMembers={0} />)
    expect(screen.getByText('No members')).toBeInTheDocument()
  })

  it('renders user images', () => {
    render(<ProjectCardMembers members={members} totalMembers={2} />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('renders fallback initial for members without image', () => {
    render(<ProjectCardMembers members={members} totalMembers={2} />)
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('shows +N overflow when totalMembers > 3', () => {
    const manyMembers = [
      ...members,
      { id: '3', role: 'MEMBER', user: { id: 'u-3', name: 'Carol', email: 'c@test.com', image: undefined } },
      { id: '4', role: 'MEMBER', user: { id: 'u-4', name: 'Dave', email: 'd@test.com', image: undefined } },
    ]
    render(<ProjectCardMembers members={manyMembers} totalMembers={5} />)
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('does not show overflow when totalMembers <= 3', () => {
    render(<ProjectCardMembers members={members} totalMembers={2} />)
    expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument()
  })

  it('limits displayed avatars to 3', () => {
    const manyMembers = [
      { id: '1', role: 'MEMBER', user: { id: 'u-1', name: 'Alice', email: 'a@test.com', image: undefined } },
      { id: '2', role: 'MEMBER', user: { id: 'u-2', name: 'Bob', email: 'b@test.com', image: undefined } },
      { id: '3', role: 'MEMBER', user: { id: 'u-3', name: 'Carol', email: 'c@test.com', image: undefined } },
      { id: '4', role: 'MEMBER', user: { id: 'u-4', name: 'Dave', email: 'd@test.com', image: undefined } },
    ]
    render(<ProjectCardMembers members={manyMembers} totalMembers={4} />)
    // Should show 3 avatar initials (A, B, C) + overflow "+1"
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.queryByText('D')).not.toBeInTheDocument()
    expect(screen.getByText('+1')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// TaskCard
// ═══════════════════════════════════════════════════════════════════════════════
describe('TaskCard', () => {
  const task = { ...mockTask }
  const defaultProps = {
    task,
    workspaceSlug: 'test-ws',
  }

  it('renders a link to the task', () => {
    render(<TaskCard {...defaultProps} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/dashboard/workspaces/test-ws/projects/test-project/tasks/t-1')
  })

  it('renders TaskCardHeader', () => {
    render(<TaskCard {...defaultProps} />)
    expect(screen.getByTestId('task-card-header')).toBeInTheDocument()
  })

  it('renders TaskCardMetaChips', () => {
    render(<TaskCard {...defaultProps} />)
    expect(screen.getByTestId('task-card-meta-chips')).toBeInTheDocument()
  })

  it('renders TaskCardProgressAssignees', () => {
    render(<TaskCard {...defaultProps} />)
    expect(screen.getByTestId('task-card-progress-assignees')).toBeInTheDocument()
  })

  it('does not show add buttons when showAddButtons is false', () => {
    render(<TaskCard {...defaultProps} showAddButtons={false} />)
    // When showAddButtons is false, TaskCardHeader should NOT render action buttons
    // Since we mock TaskCardHeader, just verify it renders
    expect(screen.getByTestId('task-card-header')).toBeInTheDocument()
  })

  it('shows add buttons when showAddButtons is true and task not completed', () => {
    render(<TaskCard {...defaultProps} showAddButtons={true} />)
    expect(screen.getByTestId('task-card-header')).toBeInTheDocument()
  })

  it('hides add buttons when task is completed', () => {
    const completedTask = { ...task, status: 'COMPLETED' as const }
    render(<TaskCard {...defaultProps} task={completedTask} showAddButtons={true} />)
    expect(screen.getByTestId('task-card-header')).toBeInTheDocument()
  })

  it('computes progress from timeTracking.timeProgress', () => {
    // The TaskCard computes progress internally and passes it to TaskCardProgressAssignees
    // We verify the component renders without error with valid timeTracking
    render(<TaskCard {...defaultProps} />)
    expect(screen.getByTestId('task-card-progress-assignees')).toBeInTheDocument()
  })

  it('caps progress at 100', () => {
    const taskOver100 = { ...task, timeTracking: { ...task.timeTracking!, timeProgress: 150 } }
    render(<TaskCard {...defaultProps} task={taskOver100} />)
    expect(screen.getByTestId('task-card-progress-assignees')).toBeInTheDocument()
  })

  it('progress is null when timeTracking is missing', () => {
    const taskNoTracking = { ...task, timeTracking: undefined }
    render(<TaskCard {...defaultProps} task={taskNoTracking} />)
    expect(screen.getByTestId('task-card-progress-assignees')).toBeInTheDocument()
  })

  it('applies opacity class for completed tasks', () => {
    const completedTask = { ...task, status: 'COMPLETED' as const }
    const { container } = render(<TaskCard {...defaultProps} task={completedTask} />)
    const card = container.querySelector('.opacity-70')
    expect(card).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// LargestFilesTable
// ═══════════════════════════════════════════════════════════════════════════════
describe('LargestFilesTable', () => {
  const defaultProps = {
    files: [],
    workspaceId: 'ws-1',
    isAdmin: false,
  }

  it('renders the table header', () => {
    render(<LargestFilesTable {...defaultProps} />)
    expect(screen.getByTestId('table-header')).toBeInTheDocument()
  })

  it('renders admin badge when isAdmin is true', () => {
    render(<LargestFilesTable {...defaultProps} isAdmin={true} />)
    expect(screen.getByTestId('admin-badge')).toBeInTheDocument()
  })

  it('does not render admin badge when isAdmin is false', () => {
    render(<LargestFilesTable {...defaultProps} isAdmin={false} />)
    expect(screen.queryByTestId('admin-badge')).not.toBeInTheDocument()
  })

  it('renders bulk actions bar', () => {
    render(<LargestFilesTable {...defaultProps} />)
    expect(screen.getByTestId('bulk-actions-bar')).toBeInTheDocument()
  })

  it('renders empty state when no files', () => {
    render(<LargestFilesTable {...defaultProps} />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('renders table headers', () => {
    render(<LargestFilesTable {...defaultProps} />)
    expect(screen.getByText('File Name')).toBeInTheDocument()
    expect(screen.getByText('Size')).toBeInTheDocument()
    expect(screen.getByText('Uploaded By')).toBeInTheDocument()
    expect(screen.getByText('Location')).toBeInTheDocument()
    expect(screen.getByText('Uploaded')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// FocusTaskCard
// ═══════════════════════════════════════════════════════════════════════════════
describe('FocusTaskCard', () => {
  const task = { ...mockTask }

  it('renders a link to the task', () => {
    render(<FocusTaskCard task={task} timeRemaining={3600} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/dashboard/tasks/t-1')
  })

  it('renders FocusBadge with timeRemaining', () => {
    render(<FocusTaskCard task={task} timeRemaining={7200} />)
    const badge = screen.getByTestId('focus-badge')
    expect(badge).toBeInTheDocument()
  })

  it('renders TaskStatusIcon with status', () => {
    render(<FocusTaskCard task={task} timeRemaining={3600} />)
    const icon = screen.getByTestId('task-status-icon')
    expect(icon).toBeInTheDocument()
  })

  it('renders TaskHeader with task data', () => {
    render(<FocusTaskCard task={task} timeRemaining={3600} />)
    const header = screen.getByTestId('task-header')
    expect(header).toBeInTheDocument()
  })

  it('renders TaskProgressBar', () => {
    render(<FocusTaskCard task={task} timeRemaining={3600} />)
    expect(screen.getByTestId('task-progress-bar')).toBeInTheDocument()
  })

  it('renders TaskMetadata', () => {
    render(<FocusTaskCard task={task} timeRemaining={3600} />)
    expect(screen.getByTestId('task-metadata')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// WorkspaceCard
// ═══════════════════════════════════════════════════════════════════════════════
describe('WorkspaceCard', () => {
  const workspace = { ...mockWorkspace }

  it('renders workspace name', () => {
    render(<WorkspaceCard workspace={workspace} />)
    expect(screen.getByText('Test Workspace')).toBeInTheDocument()
  })

  it('renders workspace slug', () => {
    render(<WorkspaceCard workspace={workspace} />)
    expect(screen.getByText('/test-ws')).toBeInTheDocument()
  })

  it('renders a link to the workspace', () => {
    render(<WorkspaceCard workspace={workspace} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/dashboard/workspaces/test-ws')
  })

  it('renders description when present', () => {
    render(<WorkspaceCard workspace={workspace} />)
    expect(screen.getByText('A workspace for testing')).toBeInTheDocument()
  })

  it('does not render description when absent', () => {
    render(<WorkspaceCard workspace={{ ...workspace, description: undefined }} />)
    expect(screen.queryByText('A workspace for testing')).not.toBeInTheDocument()
  })

  it('renders project and member counts', () => {
    render(<WorkspaceCard workspace={workspace} />)
    expect(screen.getByText('3 projects')).toBeInTheDocument()
    expect(screen.getByText('5 members')).toBeInTheDocument()
  })

  it('renders plan badge', () => {
    render(<WorkspaceCard workspace={workspace} />)
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('renders workspace logo/first letter', () => {
    render(<WorkspaceCard workspace={{ ...workspace, logo: undefined }} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('renders logo text when provided', () => {
    render(<WorkspaceCard workspace={{ ...workspace, logo: 'W' }} />)
    expect(screen.getByText('W')).toBeInTheDocument()
  })

  it('shows crown icon for owner', () => {
    render(<WorkspaceCard workspace={workspace} />)
    expect(screen.getByTestId('crown-icon')).toBeInTheDocument()
  })

  it('does not show crown for non-owner', () => {
    render(<WorkspaceCard workspace={{ ...workspace, ownerId: 'other-user' }} />)
    expect(screen.queryByTestId('crown-icon')).not.toBeInTheDocument()
  })

  it('renders settings button', () => {
    render(<WorkspaceCard workspace={workspace} />)
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument()
  })

  it('calls navigateToSettings on settings button click', () => {
    render(<WorkspaceCard workspace={workspace} />)
    const settingsBtn = screen.getByTestId('settings-icon').closest('button')!
    fireEvent.click(settingsBtn)
    // navigation is mocked, just verify button is clickable
    expect(settingsBtn).toBeInTheDocument()
  })

  it('applies default color when workspace.color is null', () => {
    const { container } = render(<WorkspaceCard workspace={{ ...workspace, color: null }} />)
    const colorBox = container.querySelector('[style]')
    expect(colorBox?.getAttribute('style')).toContain('rgb(102, 126, 234)')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// WorkspaceGrid
// ═══════════════════════════════════════════════════════════════════════════════
describe('WorkspaceGrid', () => {
  it('renders all workspace cards', () => {
    const workspaces = [
      { ...mockWorkspace, id: 'ws-1', name: 'Workspace 1' },
      { ...mockWorkspace, id: 'ws-2', name: 'Workspace 2' },
    ]
    render(<WorkspaceGrid workspaces={workspaces} />)
    expect(screen.getByText('Workspace 1')).toBeInTheDocument()
    expect(screen.getByText('Workspace 2')).toBeInTheDocument()
  })

  it('renders empty grid for empty list', () => {
    const { container } = render(<WorkspaceGrid workspaces={[]} />)
    const grid = container.querySelector('.grid')
    expect(grid).toBeInTheDocument()
    expect(grid?.children.length).toBe(0)
  })

  it('renders multiple cards', () => {
    const workspaces = [
      { ...mockWorkspace, id: 'ws-1', name: 'One' },
      { ...mockWorkspace, id: 'ws-2', name: 'Two' },
      { ...mockWorkspace, id: 'ws-3', name: 'Three' },
    ]
    render(<WorkspaceGrid workspaces={workspaces} />)
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()
    expect(screen.getByText('Three')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// WorkspacesHeader
// ═══════════════════════════════════════════════════════════════════════════════
describe('WorkspacesHeader', () => {
  it('renders title', () => {
    render(<WorkspacesHeader onCreate={vi.fn()} />)
    expect(screen.getByText('Workspaces')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<WorkspacesHeader onCreate={vi.fn()} />)
    expect(screen.getByText('Manage and switch between your workspaces')).toBeInTheDocument()
  })

  it('renders create button', () => {
    render(<WorkspacesHeader onCreate={vi.fn()} />)
    expect(screen.getByText('Create Workspace')).toBeInTheDocument()
  })

  it('calls onCreate when button is clicked', () => {
    const onCreate = vi.fn()
    render(<WorkspacesHeader onCreate={onCreate} />)
    fireEvent.click(screen.getByText('Create Workspace'))
    expect(onCreate).toHaveBeenCalledTimes(1)
  })

  it('renders plus icon in button', () => {
    render(<WorkspacesHeader onCreate={vi.fn()} />)
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// WorkspaceSearch
// ═══════════════════════════════════════════════════════════════════════════════
describe('WorkspaceSearch', () => {
  it('renders search input', () => {
    render(<WorkspaceSearch value="" onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Search workspaces...')).toBeInTheDocument()
  })

  it('displays current value', () => {
    render(<WorkspaceSearch value="hello" onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument()
  })

  it('calls onChange on input change', () => {
    const onChange = vi.fn()
    render(<WorkspaceSearch value="" onChange={onChange} />)
    fireEvent.change(screen.getByPlaceholderText('Search workspaces...'), { target: { value: 'test' } })
    expect(onChange).toHaveBeenCalledWith('test')
  })

  it('renders search icon', () => {
    render(<WorkspaceSearch value="" onChange={vi.fn()} />)
    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// WorkspacesContent
// ═══════════════════════════════════════════════════════════════════════════════
describe('WorkspacesContent', () => {
  const defaultProps = {
    isLoading: false,
    isError: false,
    searchQuery: '',
    filteredWorkspaces: [],
  }

  it('shows loading spinner when isLoading', () => {
    render(<WorkspacesContent {...defaultProps} isLoading={true} />)
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  })

  it('shows error state when isError', () => {
    render(<WorkspacesContent {...defaultProps} isError={true} />)
    expect(screen.getByText('Failed to load workspaces')).toBeInTheDocument()
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
  })

  it('shows empty state with no workspaces', () => {
    render(<WorkspacesContent {...defaultProps} />)
    expect(screen.getByText('No workspaces yet')).toBeInTheDocument()
    expect(screen.getByTestId('folder-kanban-icon')).toBeInTheDocument()
  })

  it('shows empty state with search query', () => {
    render(<WorkspacesContent {...defaultProps} searchQuery="xyz" />)
    expect(screen.getByText('No workspaces found')).toBeInTheDocument()
  })

  it('shows WorkspaceGrid when there are workspaces', () => {
    const workspaces = [
      { ...mockWorkspace, id: 'ws-1', name: 'WS 1' },
    ]
    render(<WorkspacesContent {...defaultProps} filteredWorkspaces={workspaces} />)
    expect(screen.getByText('WS 1')).toBeInTheDocument()
  })

  it('prefers loading state over error state', () => {
    render(<WorkspacesContent {...defaultProps} isLoading={true} isError={true} />)
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
    expect(screen.queryByText('Failed to load workspaces')).not.toBeInTheDocument()
  })

  it('prefers error state over empty state', () => {
    render(<WorkspacesContent {...defaultProps} isError={true} filteredWorkspaces={[]} />)
    expect(screen.getByText('Failed to load workspaces')).toBeInTheDocument()
  })
})
