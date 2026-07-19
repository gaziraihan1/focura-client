import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

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
import { EmptyState } from '@/components/Dashboard/Workspaces/TeamPage/EmptyState'

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
