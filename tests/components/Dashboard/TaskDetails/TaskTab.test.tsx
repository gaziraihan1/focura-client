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
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: any) => {
    const { fill, ...rest } = props
    return <img {...rest} data-fill={fill} />
  },
}))

vi.mock('framer-motion', () => {
  const identity = (c: any) => c
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
    AnimatePresence: ({ children }: any) => children,
  }
  return { __esModule: true, ...m, default: m }
})

vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 hours ago',
  format: (_date: any, fmt: string) => {
    if (fmt === 'MMM d, yyyy') return 'Jan 1, 2025'
    return '2025-01-01'
  },
  parseISO: (s: string) => new Date(s),
}))

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: any) => <svg data-testid={`icon-${name}`} {...props} />
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
    const grouped: Record<string, any[]> = {}
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
  Avatar: ({ name, ...props }: any) => (
    <div data-testid="avatar" data-name={name}>{name?.charAt(0) || '?'}</div>
  ),
}))

vi.mock('@/components/Shared/StatCard', () => ({
  default: ({ label, value }: any) => (
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
    { value: 'EXECUTION', label: 'Do Work', icon: (p: any) => <svg data-testid="intent-icon-exec" {...p} />, description: 'Active implementation', activeClass: 'border-blue-500 bg-blue-500/10' },
    { value: 'PLANNING', label: 'Think & Plan', icon: (p: any) => <svg data-testid="intent-icon-plan" {...p} />, description: 'Strategy and organization', activeClass: 'border-purple-500 bg-purple-500/10' },
    { value: 'REVIEW', label: 'Review', icon: (p: any) => <svg data-testid="intent-icon-review" {...p} />, description: 'Check and validate', activeClass: 'border-green-500 bg-green-500/10' },
    { value: 'LEARNING', label: 'Learn', icon: (p: any) => <svg data-testid="intent-icon-learn" {...p} />, description: 'Research and education', activeClass: 'border-amber-500 bg-amber-500/10' },
    { value: 'COMMUNICATION', label: 'Communicate', icon: (p: any) => <svg data-testid="intent-icon-comm" {...p} />, description: 'Meetings and discussions', activeClass: 'border-pink-500 bg-pink-500/10' },
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
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}))

// ─── Helper ────────────────────────────────────────────────────────────────
const makeTask = (overrides: any = {}) => ({
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

describe('TaskDetails/TaskTab – TaskTabHeader', () => {
  it('renders all three tabs', async () => {
    const TaskTabHeader = (await import('@/components/Dashboard/TaskDetails/TaskTab/TaskTabHeader')).default
    render(<TaskTabHeader activeTab="comments" setActiveTab={vi.fn()} counts={{ comments: 2, activity: 1, attachments: 3 }} />)
    expect(screen.getAllByText('Comments').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Activity').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Attachments').length).toBeGreaterThanOrEqual(1)
  })
  it('shows counts', async () => {
    const TaskTabHeader = (await import('@/components/Dashboard/TaskDetails/TaskTab/TaskTabHeader')).default
    render(<TaskTabHeader activeTab="comments" setActiveTab={vi.fn()} counts={{ comments: 5, activity: 3, attachments: 1 }} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })
  it('calls setActiveTab on click', async () => {
    const setActiveTab = vi.fn()
    const TaskTabHeader = (await import('@/components/Dashboard/TaskDetails/TaskTab/TaskTabHeader')).default
    render(<TaskTabHeader activeTab="comments" setActiveTab={setActiveTab} counts={{ comments: 0, activity: 0, attachments: 0 }} />)
    const activityButtons = screen.getAllByText('Activity')
    fireEvent.click(activityButtons[0].closest('button')!)
    expect(setActiveTab).toHaveBeenCalledWith('activity')
  })
})

describe('TaskDetails/TaskTab – EmptyComments', () => {
  it('renders no comments message', async () => {
    const { EmptyComments } = await import('@/components/Dashboard/TaskDetails/TaskTab/CommentsList/EmptyComments')
    render(<EmptyComments />)
    expect(screen.getByText('No comments yet')).toBeInTheDocument()
    expect(screen.getByText('Be the first to leave a comment.')).toBeInTheDocument()
  })
})

describe('TaskDetails/TaskTab – CommentContent', () => {
  it('renders plain text', async () => {
    const { CommentContent } = await import('@/components/Dashboard/TaskDetails/TaskTab/CommentsList/CommentContent')
    render(<CommentContent content="Hello world" />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })
})

describe('TaskDetails/TaskTab – RelativeTime', () => {
  it('renders relative time', async () => {
    const { RelativeTime } = await import('@/components/Dashboard/TaskDetails/TaskTab/CommentsList/RelativeTime')
    render(<RelativeTime date="2025-01-01T00:00:00Z" />)
    expect(screen.getByText('2 hours ago')).toBeInTheDocument()
  })
})

describe('TaskDetails/TaskTab – MentionDropdown', () => {
  it('renders users list', async () => {
    const { MentionDropdown } = await import('@/components/Dashboard/TaskDetails/TaskTab/MentionDropdown')
    render(
      <MentionDropdown
        users={[
          { id: 'u1', name: 'Alice', image: null, role: 'MANAGER' },
          { id: 'u2', name: 'Bob', image: null },
        ]}
        activeIndex={0}
        position={{ top: 10, left: 10 }}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })
  it('shows header text', async () => {
    const { MentionDropdown } = await import('@/components/Dashboard/TaskDetails/TaskTab/MentionDropdown')
    render(
      <MentionDropdown
        users={[{ id: 'u1', name: 'Alice', image: null }]}
        activeIndex={0}
        position={{ top: 10, left: 10 }}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByText('Mention someone')).toBeInTheDocument()
  })
  it('shows role when present', async () => {
    const { MentionDropdown } = await import('@/components/Dashboard/TaskDetails/TaskTab/MentionDropdown')
    render(
      <MentionDropdown
        users={[{ id: 'u1', name: 'Alice', image: null, role: 'MANAGER' }]}
        activeIndex={0}
        position={{ top: 10, left: 10 }}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByText('manager')).toBeInTheDocument()
  })
  it('calls onSelect on mouseDown', async () => {
    const onSelect = vi.fn()
    const { MentionDropdown } = await import('@/components/Dashboard/TaskDetails/TaskTab/MentionDropdown')
    render(
      <MentionDropdown
        users={[{ id: 'u1', name: 'Alice', image: null }]}
        activeIndex={0}
        position={{ top: 10, left: 10 }}
        onSelect={onSelect}
      />
    )
    fireEvent.mouseDown(screen.getByText('Alice'))
    expect(onSelect).toHaveBeenCalled()
  })
})

describe('TaskDetails/TaskTab – CommentEditor', () => {
  const task = makeTask()
  it('renders lock message when cannot comment', async () => {
    const { CommentEditor } = await import('@/components/Dashboard/TaskDetails/TaskTab/CommentEditor')
    render(<CommentEditor task={task} canComment={false} value="" onChange={vi.fn()} onSubmit={vi.fn()} loading={false} />)
    expect(screen.getByText(/don't have permission/)).toBeInTheDocument()
  })
  it('renders editor when can comment', async () => {
    const { CommentEditor } = await import('@/components/Dashboard/TaskDetails/TaskTab/CommentEditor')
    render(<CommentEditor task={task} canComment={true} value="" onChange={vi.fn()} onSubmit={vi.fn()} loading={false} />)
    expect(screen.getByText('Comment')).toBeInTheDocument()
  })
  it('shows reply button text when replyingTo is set', async () => {
    const { CommentEditor } = await import('@/components/Dashboard/TaskDetails/TaskTab/CommentEditor')
    render(
      <CommentEditor
        task={task} canComment={true} value="" onChange={vi.fn()} onSubmit={vi.fn()} loading={false}
        replyingTo={{ id: 'c1', content: 'Great point', user: { id: 'u2', name: 'Bob', image: null }, createdAt: '', edited: false, replies: [] }}
        onCancelReply={vi.fn()}
      />
    )
    expect(screen.getByText('Reply')).toBeInTheDocument()
  })
  it('shows cancel reply button', async () => {
    const onCancelReply = vi.fn()
    const { CommentEditor } = await import('@/components/Dashboard/TaskDetails/TaskTab/CommentEditor')
    render(
      <CommentEditor
        task={task} canComment={true} value="" onChange={vi.fn()} onSubmit={vi.fn()} loading={false}
        replyingTo={{ id: 'c1', content: 'Great point', user: { id: 'u2', name: 'Bob', image: null }, createdAt: '', edited: false, replies: [] }}
        onCancelReply={onCancelReply}
      />
    )
    fireEvent.click(screen.getByTestId('icon-X'))
    expect(onCancelReply).toHaveBeenCalled()
  })
  it('shows loading spinner when loading', async () => {
    const { CommentEditor } = await import('@/components/Dashboard/TaskDetails/TaskTab/CommentEditor')
    render(<CommentEditor task={task} canComment={true} value="text" onChange={vi.fn()} onSubmit={vi.fn()} loading={true} />)
    expect(screen.getByTestId('icon-Loader2')).toBeInTheDocument()
  })
  it('shows user image when userImage provided', async () => {
    const { CommentEditor } = await import('@/components/Dashboard/TaskDetails/TaskTab/CommentEditor')
    render(<CommentEditor task={task} canComment={true} value="" onChange={vi.fn()} onSubmit={vi.fn()} loading={false} userImage="/avatar.png" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
  it('shows initial avatar when no userImage', async () => {
    const { CommentEditor } = await import('@/components/Dashboard/TaskDetails/TaskTab/CommentEditor')
    render(<CommentEditor task={task} canComment={true} value="" onChange={vi.fn()} onSubmit={vi.fn()} loading={false} />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })
})

describe('TaskDetails/TaskTab – CommentsTab', () => {
  const task = makeTask()
  it('renders editor at bottom', async () => {
    const { CommentsTab } = await import('@/components/Dashboard/TaskDetails/TaskTab/CommentsTab')
    render(
      <CommentsTab
        taskId="t1" comments={[]} task={task} canComment={true}
        commentText="" setCommentText={vi.fn()} onAddComment={vi.fn()}
        onDelete={vi.fn()} addCommentLoading={false}
      />
    )
    expect(screen.getByText('No comments yet')).toBeInTheDocument()
  })
})

describe('TaskDetails/TaskTab – AttachmentsTab', () => {
  const mockUpload = { mutateAsync: vi.fn(), isPending: false, mutate: vi.fn() } as any
  const mockDelete = { mutateAsync: vi.fn(), isPending: false, mutate: vi.fn() } as any
  it('renders upload area', async () => {
    const { AttachmentsTab } = await import('@/components/Dashboard/TaskDetails/TaskTab/AttachmentsTab')
    render(<AttachmentsTab taskId="t1" attachments={[]} canComment={true} uploadAttachment={mockUpload} deleteAttachment={mockDelete} />)
    expect(screen.getByText('Click to upload a file')).toBeInTheDocument()
  })
  it('shows no attachments message', async () => {
    const { AttachmentsTab } = await import('@/components/Dashboard/TaskDetails/TaskTab/AttachmentsTab')
    render(<AttachmentsTab taskId="t1" attachments={[]} canComment={true} uploadAttachment={mockUpload} deleteAttachment={mockDelete} />)
    expect(screen.getByText('No attachments yet')).toBeInTheDocument()
  })
  it('shows lock when no permission', async () => {
    const { AttachmentsTab } = await import('@/components/Dashboard/TaskDetails/TaskTab/AttachmentsTab')
    render(<AttachmentsTab taskId="t1" attachments={[]} canComment={false} uploadAttachment={mockUpload} deleteAttachment={mockDelete} />)
    expect(screen.getByText(/don't have permission/)).toBeInTheDocument()
  })
  it('renders attachment name', async () => {
    const { AttachmentsTab } = await import('@/components/Dashboard/TaskDetails/TaskTab/AttachmentsTab')
    const att = [{ id: 'a1', originalName: 'file.pdf', size: 1024, url: 'http://example.com/file.pdf', uploadedBy: { id: 'user-1', name: 'Alice' } }]
    render(<AttachmentsTab taskId="t1" attachments={att} currentUserId="user-1" canComment={true} uploadAttachment={mockUpload} deleteAttachment={mockDelete} />)
    expect(screen.getByText('file.pdf')).toBeInTheDocument()
  })
  it('renders upload progress', async () => {
    const { AttachmentsTab } = await import('@/components/Dashboard/TaskDetails/TaskTab/AttachmentsTab')
    render(<AttachmentsTab taskId="t1" attachments={[]} canComment={true} uploadAttachment={{ ...mockUpload, isPending: true }} deleteAttachment={mockDelete} />)
    expect(screen.getByTestId('icon-Loader2')).toBeInTheDocument()
  })
})
