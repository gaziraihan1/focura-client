import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// ─── Global mocks ────────────────────────────────────────────────────────────
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ workspaceSlug: 'test-ws' }),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}))

vi.mock('date-fns', () => ({
  format: (_date: Date | string, fmt: string) => 'Jan 15',
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: 'user-1', name: 'Test User' } },
    status: 'authenticated',
  }),
}))

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name }: { name: string }) => <div data-testid="avatar">{name}</div>,
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
  TableHeader: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="table-header" {...props} />,
}))
vi.mock('@/components/Dashboard/Storage/LargestFilesTable/AdminBadge', () => ({
  AdminBadge: () => <div data-testid="admin-badge" />,
}))
vi.mock('@/components/Dashboard/Storage/LargestFilesTable/BulkActionsBar', () => ({
  BulkActionsBar: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="bulk-actions-bar" {...props} />,
}))
vi.mock('@/components/Dashboard/Storage/LargestFilesTable/FileTableRow', () => ({
  FileTableRow: (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr data-testid="file-table-row" {...props} />,
}))
vi.mock('@/components/Dashboard/Storage/LargestFilesTable/EmptyState', () => ({
  EmptyState: () => <div data-testid="empty-state" />,
}))

vi.mock('@/components/Dashboard/AllTasks/FocusTaskCard/FocusBadge', () => ({
  FocusBadge: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="focus-badge" {...props} />,
}))
vi.mock('@/components/Dashboard/AllTasks/FocusTaskCard/TaskStatusIcon', () => ({
  TaskStatusIcon: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="task-status-icon" {...props} />,
}))
vi.mock('@/components/Dashboard/AllTasks/FocusTaskCard/TaskHeader', () => ({
  TaskHeader: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="task-header" {...props} />,
}))
vi.mock('@/components/Dashboard/AllTasks/FocusTaskCard/TaskProgressBar', () => ({
  TaskProgressBar: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="task-progress-bar" {...props} />,
}))
vi.mock('@/components/Dashboard/AllTasks/FocusTaskCard/TaskMetadata', () => ({
  TaskMetadata: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="task-metadata" {...props} />,
}))

vi.mock('@/components/Dashboard/AllTasks/WorkspaceTasks/TaskCardParts', () => ({
  TaskCardHeader: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="task-card-header" {...props} />,
  TaskCardMetaChips: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="task-card-meta-chips" {...props} />,
  TaskCardProgressAssignees: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="task-card-progress-assignees" {...props} />,
}))

vi.mock('@/components/Dashboard/Workspaces/TeamPage/ProjectMembersPanel', () => ({
  ProjectMembersPanel: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="project-members-panel" {...props} />,
}))

vi.mock('lucide-react', () => ({
  Users: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="users-icon" {...props} />,
  FolderOpen: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="folder-icon" {...props} />,
  ShieldCheck: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="shield-icon" {...props} />,
  Award: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="award-icon" {...props} />,
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="chevron-icon" {...props} />,
  CheckCircle2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="check-icon" {...props} />,
  Circle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="circle-icon" {...props} />,
  Search: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="search-icon" {...props} />,
  MoreVertical: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="more-vertical-icon" {...props} />,
  Calendar: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="calendar-icon" {...props} />,
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="alert-icon" {...props} />,
  Plus: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="plus-icon" {...props} />,
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="loader-icon" {...props} />,
  Crown: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="crown-icon" {...props} />,
  FolderKanban: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="folder-kanban-icon" {...props} />,
  Settings: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="settings-icon" {...props} />,
  CheckSquare: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="check-square-icon" {...props} />,
  Square: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="square-icon" {...props} />,
}))

// ─── Imports under test ──────────────────────────────────────────────────────
import { FocusTaskCard } from '@/components/Dashboard/AllTasks/FocusTaskCard'

// ─── Shared test data ────────────────────────────────────────────────────────
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
