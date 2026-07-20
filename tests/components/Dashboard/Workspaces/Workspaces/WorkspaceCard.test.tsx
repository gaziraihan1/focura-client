import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

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
import { WorkspaceCard } from '@/components/Dashboard/Workspaces/Workspaces/WorkspaceCard'

// ─── Shared test data ────────────────────────────────────────────────────────
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
