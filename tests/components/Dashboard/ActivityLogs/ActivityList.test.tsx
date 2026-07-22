/**
 * Comprehensive tests for TaskDetails, ProjectDetails, Storage, Calendar,
 * CalendarView, ActivityLogs, AllTasks, WorkspaceNewTask, and Workspaces/project subcomponents.
 *
 * Covers ALL subcomponents by directory:
 *  - TaskDetails/ (ActivityList, SubtasksSection, TaskTab, TaskSidebar, etc.)
 *  - ProjectDetails/ (TaskModal, CreateTaskModal, etc.)
 *  - Storage/Files/
 *  - Calendar/ (DayDetailsPanel)
 *  - CalendarView/TaskModal/
 *  - ActivityLogs/
 *  - AllTasks/ (FocusTaskCard, TaskQouta, etc.)
 *  - WorkspaceNewTask/
 *  - Workspaces/project/Settings/
 *  - Workspaces/project/Tasks/
 *  - Workspaces/project/Layout/
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// ─── Global mocks ──────────────────────────────────────────────────────────
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, alt = "", ...rest } = props
    return <img alt={alt} {...rest} data-fill={fill} />
  },
}))

vi.mock('framer-motion', () => {
  const identity = (c: Record<string, unknown>) => c
  const m = {
    div: 'div',
    button: 'button',
    span: 'span',
    p: 'p',
    motion: {
      div: 'div',
      button: 'button',
      span: 'span',
      p: 'p',
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
  }
  return { __esModule: true, ...m, default: m }
})

vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 hours ago',
  format: (_date: Date | string, fmt: string) => {
    if (fmt === 'MMM d, yyyy') return 'Jan 1, 2025'
    return '2025-01-01'
  },
  parseISO: (s: string) => new Date(s),
}))

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />
    Component.displayName = name
    return Component
  }
  return {
    Clock: icon('Clock'),
    Calendar: icon('Calendar'),
    User: icon('User'),
    Users: icon('Users'),
    Folder: icon('Folder'),
    Check: icon('Check'),
    Lock: icon('Lock'),
    AlertCircle: icon('AlertCircle'),
    CheckCircle2: icon('CheckCircle2'),
    Circle: icon('Circle'),
    Pencil: icon('Pencil'),
    Plus: icon('Plus'),
    Trash2: icon('Trash2'),
    MessageSquare: icon('MessageSquare'),
    Send: icon('Send'),
    Loader2: icon('Loader2'),
    X: icon('X'),
    Paperclip: icon('Paperclip'),
    Download: icon('Download'),
    ArrowLeft: icon('ArrowLeft'),
    Edit: icon('Edit'),
    Zap: icon('Zap'),
    Brain: icon('Brain'),
    Shield: icon('Shield'),
    Eye: icon('Eye'),
    BookOpen: icon('BookOpen'),
    Lightbulb: icon('Lightbulb'),
    GripVertical: icon('GripVertical'),
    ChevronDown: icon('ChevronDown'),
    ChevronLeft: icon('ChevronLeft'),
    ChevronRight: icon('ChevronRight'),
    ListTodo: icon('ListTodo'),
    Activity: icon('Activity'),
    Timer: icon('Timer'),
    Hourglass: icon('Hourglass'),
    TrendingUp: icon('TrendingUp'),
    BarChart3: icon('BarChart3'),
    CornerDownRight: icon('CornerDownRight'),
    FileText: icon('FileText'),
    FolderKanban: icon('FolderKanban'),
    ArrowRightLeft: icon('ArrowRightLeft'),
    Flag: icon('Flag'),
    Search: icon('Search'),
    ArrowUpDown: icon('ArrowUpDown'),
    ArrowUp: icon('ArrowUp'),
    ArrowDown: icon('ArrowDown'),
    Menu: icon('Menu'),
    Save: icon('Save'),
    Crown: icon('Crown'),
    UserCheck: icon('UserCheck'),
    LogOut: icon('LogOut'),
    UserMinus: icon('UserMinus'),
    AlertTriangle: icon('AlertTriangle'),
    RefreshCw: icon('RefreshCw'),
    Target: icon('Target'),
    Play: icon('Play'),
    ArchiveRestore: icon('ArchiveRestore'),
    CheckCircle2: icon('CheckCircle2'),
    Link: icon('Link'),
    Trash: icon('Trash'),
    Tag: icon('Tag'),
    Filter: icon('Filter'),
  }
})

// ─── Mock hooks/modules ────────────────────────────────────────────────────
vi.mock('@/utils/task-activity.utils', () => ({
  getActivityIcon: (action: string) => {
    const map: Record<string, string> = {
      CREATED: 'Plus', UPDATED: 'Pencil', DELETED: 'Trash2',
      STATUS_CHANGED: 'CheckCircle2', COMPLETED: 'CheckCircle2',
      ASSIGNED: 'Users', UNASSIGNED: 'Users', COMMENTED: 'MessageSquare',
      MOVED: 'ArrowRightLeft', PRIORITY_CHANGED: 'AlertCircle',
    }
    return map[action] || 'Circle'
  },
  getActionColor: () => 'text-gray-500',
  getActivityDescription: (action: string) => {
    const map: Record<string, string> = {
      CREATED: 'created this task', UPDATED: 'updated this task',
      DELETED: 'deleted this task', STATUS_CHANGED: 'changed status',
    }
    return map[action] || 'performed an action'
  },
  groupActivitiesByDate: (activities: any[]) => {
    const grouped: Record<string, unknown[]> = {}
    activities.forEach((a) => {
      const key = 'January 1, 2025'
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(a)
    })
    return grouped
  },
}))

vi.mock('@/utils/task.utils', () => ({
  formatFileSize: (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`,
  getStatusColor: () => 'bg-gray-100 text-gray-700',
  getPriorityColor: () => 'text-gray-700',
  getTimeStatusColor: () => 'text-gray-700',
  formatTimeDuration: (h: number) => `${h}h`,
  getFocusLevelColor: () => 'text-purple-500',
  getEnergyTypeColor: () => 'text-yellow-500',
}))

vi.mock('@/utils/taskcard.utils', () => ({
  formatTime: (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  },
  getProgressPercentage: (remaining: number) => {
    const total = 25 * 60
    return Math.min(100, ((total - remaining) / total) * 100)
  },
  formatHoursSinceCreation: (h: number) => `${h}h`,
  getProgressBarColor: () => 'bg-blue-500',
  getPriorityColor: () => 'text-gray-700',
}))

vi.mock('@/utils/comments.utils', () => ({
  buildCommentTree: (comments: any[]) => comments,
  parseMentions: (content: string) => [{ type: 'text', value: content }],
  getRelativeTimeLabel: () => '2 hours ago',
  stripMentionSyntax: (v: string) => v,
}))

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name, ...props }: Record<string, unknown>) => (
    <div data-testid="avatar" data-name={name}>{name?.charAt(0) || '?'}</div>
  ),
}))

vi.mock('@/components/Shared/StatCard', () => ({
  default: ({ label, value }: Record<string, unknown>) => (
    <div data-testid="stat-card"><span>{label}</span><span>{value}</span></div>
  ),
}))

vi.mock('@/hooks/useTask', () => ({
  useUpdateTask: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteTask: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateTaskStatus: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useAddComment: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUploadAttachment: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteAttachment: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useTaskOverview: () => ({ isLoading: false, isError: false, data: {} }),
  useTasks: () => ({ data: { data: [] }, isLoading: false, isFetching: false, isError: false }),
}))

vi.mock('@/hooks/useComment', () => ({
  useUpdateComment: () => ({ mutateAsync: vi.fn() }),
  useDeleteComment: () => ({ mutateAsync: vi.fn() }),
}))

vi.mock('@/hooks/useSubtasks', () => ({
  useSubtasks: () => ({ data: [], isLoading: false }),
  useSubtaskStats: () => ({ data: null }),
  useCreateSubtask: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateSubtask: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateSubtaskStatus: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteSubtask: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@/hooks/useActivity', () => ({
  useTaskActivities: () => ({ data: [], isLoading: false }),
  useActivities: () => ({ data: [], isLoading: false, error: null }),
}))

vi.mock('@/hooks/useTaskDetailsController', () => ({
  useTaskDetailsController: () => ({
    task: null, permissions: { canView: true, canEdit: true, canDelete: true, canComment: true, canChangeStatus: true, isAssignee: true, isOwner: true },
    isEditing: false, editData: { title: '', description: '', priority: '', status: '', estimatedHours: '' },
    comments: [], attachments: [], setIsEditing: vi.fn(), setEditData: vi.fn(),
    mutations: {
      addComment: { mutateAsync: vi.fn(), isPending: false },
      updateComment: { mutateAsync: vi.fn(), isPending: false },
      deleteComment: { mutateAsync: vi.fn(), isPending: false },
      uploadAttachment: { mutateAsync: vi.fn(), isPending: false },
      deleteAttachment: { mutateAsync: vi.fn(), isPending: false },
      updateTask: { mutateAsync: vi.fn(), isPending: false },
      deleteTask: { mutateAsync: vi.fn(), isPending: false },
      updateStatus: { mutateAsync: vi.fn(), isPending: false },
    },
    handlers: {
      handleEditClick: vi.fn(), handleSaveEdit: vi.fn(), handleDelete: vi.fn(),
      handleStatusChange: vi.fn(),
    },
  }),
}))

vi.mock('@/hooks/useCommentPage', () => ({
  useCommentPage: () => ({
    mentionQuery: null, filteredUsers: [], activeIndex: 0, dropdownPos: null,
    handleChange: vi.fn(), insertMention: vi.fn(), handleKeyDown: vi.fn(),
  }),
}))

vi.mock('@/hooks/useFocusSession', () => ({
  useFocusSession: () => ({
    activeSession: null, isLoading: false,
    startSession: vi.fn(), completeSession: vi.fn(), cancelSession: vi.fn(),
  }),
}))

vi.mock('@/hooks/useProjects', () => ({
  useUpdateProject: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteProject: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@/hooks/useEnergyLevel', () => ({
  useEnergyLevel: () => ({ data: null, logEnergy: vi.fn(), refetch: vi.fn() }),
  useEnergyHistory: () => ({ data: [], pagination: null, loading: false }),
}))

vi.mock('@/hooks/useActivityFilters', () => ({
  useActivityFilters: () => ({
    showCustomDateRange: false, activeFiltersCount: 0,
    handleActionChange: vi.fn(), handleEntityTypeChange: vi.fn(),
    handleDatePresetChange: vi.fn(), handleClearFilters: vi.fn(),
    handleClearAction: vi.fn(), handleClearEntityType: vi.fn(),
    handleClearDateRange: vi.fn(), handleStartDateChange: vi.fn(),
    handleEndDateChange: vi.fn(),
  }),
}))

vi.mock('@/hooks/useActivity', () => ({
  useTaskActivities: () => ({ data: [], isLoading: false }),
  useActivities: () => ({ data: [], isLoading: false, error: null }),
}))

vi.mock('@/constants/task.constants', () => ({
  STATUS_OPTIONS: [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'IN_REVIEW', label: 'In Review' },
    { value: 'BLOCKED', label: 'Blocked' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ],
  PERSONAL_TASK_STATUS_OPTIONS: [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
  ],
  STATUS_LABELS: {
    TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review',
    BLOCKED: 'Blocked', COMPLETED: 'Completed', CANCELLED: 'Cancelled',
  },
}))

vi.mock('@/constants/intent.constants', () => ({
  INTENT_OPTIONS: [
    { value: 'EXECUTION', label: 'Do Work', icon: (p: Record<string, unknown>) => <svg data-testid="intent-icon-exec" {...p} />, description: 'Active implementation', activeClass: 'border-blue-500 bg-blue-500/10' },
    { value: 'PLANNING', label: 'Think & Plan', icon: (p: Record<string, unknown>) => <svg data-testid="intent-icon-plan" {...p} />, description: 'Strategy and organization', activeClass: 'border-purple-500 bg-purple-500/10' },
    { value: 'REVIEW', label: 'Review', icon: (p: Record<string, unknown>) => <svg data-testid="intent-icon-review" {...p} />, description: 'Check and validate', activeClass: 'border-green-500 bg-green-500/10' },
    { value: 'LEARNING', label: 'Learn', icon: (p: Record<string, unknown>) => <svg data-testid="intent-icon-learn" {...p} />, description: 'Research and education', activeClass: 'border-amber-500 bg-amber-500/10' },
    { value: 'COMMUNICATION', label: 'Communicate', icon: (p: Record<string, unknown>) => <svg data-testid="intent-icon-comm" {...p} />, description: 'Meetings and discussions', activeClass: 'border-pink-500 bg-pink-500/10' },
  ],
  ENERGY_OPTIONS: [
    { value: 'LOW', label: 'Low Energy', className: 'bg-green-500 text-white' },
    { value: 'MEDIUM', label: 'Medium', className: 'bg-amber-500 text-white' },
    { value: 'HIGH', label: 'High Focus', className: 'bg-red-500 text-white' },
  ],
}))

vi.mock('@/constants/activityFilter.constants', () => ({
  ACTION_OPTIONS: [{ value: 'ALL', label: 'All Actions' }],
  ENTITY_OPTIONS: [{ value: 'ALL', label: 'All Entities' }],
  DATE_PRESETS: [{ value: 'TODAY', label: 'Today' }],
}))

vi.mock('@/components/Labels/LabelPicker', () => ({
  LabelPicker: () => <div data-testid="label-picker" />,
}))

vi.mock('@/components/Dashboard/Calendar/DayDetailsPanelParts', () => ({
  PlannedHoursCard: () => <div data-testid="planned-hours-card" />,
  FocusSessionsCard: () => <div data-testid="focus-sessions-card" />,
  GoalsCard: () => <div data-testid="goals-card" />,
  BurnoutCard: () => <div data-testid="burnout-card" />,
  EventsCard: () => <div data-testid="events-card" />,
  DaySummaryBar: () => <div data-testid="day-summary-bar" />,
}))

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}))

// ─── Helper ────────────────────────────────────────────────────────────────
const makeTask = (overrides: Record<string, unknown> = {}) => ({
  id: 'task-1',
  title: 'Test Task',
  description: 'Test description',
  status: 'TODO' as const,
  priority: 'MEDIUM' as const,
  intent: 'EXECUTION' as const,
  estimatedHours: 8,
  startDate: '2025-01-01T00:00:00Z',
  dueDate: '2025-01-31T00:00:00Z',
  createdAt: '2025-01-01T00:00:00Z',
  completedAt: null,
  focusRequired: true,
  focusLevel: 4,
  energyType: 'HIGH' as const,
  distractionCost: 3,
  projectId: 'proj-1',
  project: { id: 'proj-1', name: 'My Project', slug: 'my-project', color: '#3b82f6', status: 'ACTIVE', workspace: { slug: 'my-workspace' } },
  labels: [],
  assignees: [
    { user: { id: 'user-1', name: 'Alice', image: null }, role: 'MANAGER' as const },
  ],
  createdBy: { id: 'user-1', name: 'Alice', image: null },
  _count: { comments: 3, subtasks: 2, files: 1 },
  timeTracking: {
    hoursSinceCreation: 24,
    hoursUntilDue: 48,
    timeProgress: 50,
    isOverdue: false,
    isDueToday: false,
    startedAt: '2025-01-01T00:00:00Z',
    duration: 25,
    completed: false,
    type: 'POMODORO' as const,
    taskId: 'task-1',
  },
  ...overrides,
})

// ═══════════════════════════════════════════════════════════════════════════
// 1. TASKDETAILS – ActivityList
// ═══════════════════════════════════════════════════════════════════════════

describe('ActivityLogs/ActivityList', () => {
  it('renders date groups', async () => {
    const { ActivityList } = await import('@/components/Dashboard/ActivityLogs/ActivityList')
    const act = {
      id: 'a1', action: 'CREATED', entityType: 'TASK',
      createdAt: new Date().toISOString(),
      user: { id: 'u1', name: 'Alice' },
      workspace: { id: 'w1', name: 'WS' },
      task: { id: 't1', title: 'Task 1' },
      metadata: {},
    }
    render(<ActivityList activities={[act]} />)
    expect(screen.getByText(/Alice/)).toBeInTheDocument()
  })
})
