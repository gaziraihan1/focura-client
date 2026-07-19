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
import { ProjectCard } from '@/components/Dashboard/Workspaces/TeamPage/ProjectCard'

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
