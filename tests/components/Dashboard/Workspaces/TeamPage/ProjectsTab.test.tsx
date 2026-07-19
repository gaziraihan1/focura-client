import { describe, it, expect, vi } from 'vitest'
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

vi.mock('@/components/Dashboard/AllTasks/WorkspaceTasks/TaskCardParts', () => ({
  TaskCardHeader: (props: any) => <div data-testid="task-card-header" {...props} />,
  TaskCardMetaChips: (props: any) => <div data-testid="task-card-meta-chips" {...props} />,
  TaskCardProgressAssignees: (props: any) => <div data-testid="task-card-progress-assignees" {...props} />,
}))

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

// ─── Imports under test ──────────────────────────────────────────────────────
import { ProjectsTab } from '@/components/Dashboard/Workspaces/TeamPage/ProjectsTab'

// ─── Shared test data ────────────────────────────────────────────────────────
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
