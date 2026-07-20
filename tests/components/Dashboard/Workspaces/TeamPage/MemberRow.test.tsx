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
import { MemberRow } from '@/components/Dashboard/Workspaces/TeamPage/MemberRow'

// ─── Shared test data ────────────────────────────────────────────────────────
const mockMember = {
  id: 'm-1',
  user: { id: 'u-1', name: 'Alice', email: 'alice@test.com', image: null },
  displayName: 'Alice',
  role: 'MEMBER' as const,
  joinedAt: '2024-06-15T00:00:00Z',
}

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
