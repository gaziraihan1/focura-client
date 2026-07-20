import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

vi.mock('lucide-react', () => {
  const React = require('react')
  const mock = (name: string) => {
    const Cmp = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    Cmp.displayName = name
    return Cmp
  }
  return {
    Loader2: mock('loader2'),
    AlertTriangle: mock('alert-triangle'),
    BarChart3: mock('bar-chart3'),
    Folder: mock('folder'),
    CheckCircle2: mock('check-circle2'),
    CheckCircle: mock('check-circle'),
    AlertCircle: mock('alert-circle'),
    Clock: mock('clock'),
    Users: mock('users'),
    TrendingUp: mock('trending-up'),
    Crown: mock('crown'),
    User: mock('user'),
    Calendar: mock('calendar'),
    Activity: mock('activity'),
    Flame: mock('flame'),
    Search: mock('search'),
    ArrowUpDown: mock('arrow-up-down'),
    ArrowUp: mock('arrow-up'),
    ArrowDown: mock('arrow-down'),
    Megaphone: mock('megaphone'),
    Menu: mock('menu'),
    X: mock('x'),
    ChevronLeft: mock('chevron-left'),
    Pin: mock('pin'),
    Trash2: mock('trash2'),
    Globe: mock('globe'),
    Lock: mock('lock'),
    Plus: mock('plus'),
    Building2: mock('building2'),
    HardDrive: mock('hard-drive'),
    Timer: mock('timer'),
    LayoutGrid: mock('layout-grid'),
    Zap: mock('zap'),
    Infinity: mock('infinity'),
    Bold: mock('bold'),
    Italic: mock('italic'),
    Code2: mock('code2'),
    Link2: mock('link2'),
    CornerDownLeft: mock('corner-down-left'),
    Check: mock('check'),
    Copy: mock('copy'),
    FolderOpen: mock('folder-open'),
    RotateCcw: mock('rotate-ccw'),
    ArrowLeft: mock('arrow-left'),
    UserCircle2: mock('user-circle2'),
  }
})

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}))

import { ProjectHealthCards } from '@/components/Dashboard/Workspaces/Analytics/ProjectHealthCards'
import type { ProjectHealth } from '@/hooks/useAnalytics'

const mockProjectHealthData: ProjectHealth[] = [
  {
    projectId: 'p-1',
    projectName: 'Project Alpha',
    status: 'ACTIVE',
    progress: 75,
    totalTasks: 40,
    completedTasks: 30,
    remainingTasks: 10,
    dueDate: new Date('2025-06-01'),
    health: 'healthy',
  },
  {
    projectId: 'p-2',
    projectName: 'Project Beta',
    status: 'PLANNING',
    progress: 30,
    totalTasks: 20,
    completedTasks: 6,
    remainingTasks: 14,
    dueDate: null,
    health: 'at-risk',
  },
  {
    projectId: 'p-3',
    projectName: 'Project Gamma',
    status: 'ACTIVE',
    progress: 10,
    totalTasks: 15,
    completedTasks: 1,
    remainingTasks: 14,
    dueDate: new Date('2025-03-01'),
    health: 'critical',
  },
]

describe('ProjectHealthCards', () => {
  it('renders the title', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    expect(screen.getByText('Project Health')).toBeInTheDocument()
  })

  it('renders all project names', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    expect(screen.getByText('Project Alpha')).toBeInTheDocument()
    expect(screen.getByText('Project Beta')).toBeInTheDocument()
    expect(screen.getByText('Project Gamma')).toBeInTheDocument()
  })

  it('shows task completion info', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    expect(screen.getByText('30 of 40 tasks')).toBeInTheDocument()
    expect(screen.getByText('6 of 20 tasks')).toBeInTheDocument()
  })

  it('displays health status labels', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    expect(screen.getByText('healthy')).toBeInTheDocument()
    expect(screen.getByText('at-risk')).toBeInTheDocument()
    expect(screen.getByText('critical')).toBeInTheDocument()
  })

  it('displays progress percentage', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
    expect(screen.getByText('10%')).toBeInTheDocument()
  })

  it('shows project status', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    const activeStatuses = screen.getAllByText('ACTIVE')
    expect(activeStatuses.length).toBe(2)
    expect(screen.getByText('PLANNING')).toBeInTheDocument()
  })

  it('shows due date when present', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    const dueLabels = screen.getAllByText(/Due/)
    expect(dueLabels.length).toBeGreaterThanOrEqual(1)
  })

  it('renders empty state when no data', () => {
    render(<ProjectHealthCards data={[]} />)
    expect(screen.getByText('No projects yet')).toBeInTheDocument()
  })
})
