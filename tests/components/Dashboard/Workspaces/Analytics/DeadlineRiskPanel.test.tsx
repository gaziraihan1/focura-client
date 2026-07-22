import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

vi.mock('lucide-react', () => {

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

vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '3 days ago',
  format: () => 'Jan 15, 2025',
}))

import { DeadlineRiskPanel } from '@/components/Dashboard/Workspaces/Analytics/DeadlineRiskPanel'
import type { DeadlineRisk } from '@/hooks/useAnalytics'

const mockDeadlineRiskData: DeadlineRisk = {
  dueIn3Days: [
    {
      id: 't-1',
      title: 'Urgent Task Alpha',
      dueDate: new Date('2025-01-16'),
      priority: 'URGENT',
      assignedTo: 'Alice',
    },
    {
      id: 't-2',
      title: 'Urgent Task Beta',
      dueDate: new Date('2025-01-17'),
      priority: 'HIGH',
      assignedTo: undefined,
    },
  ],
  dueIn7DaysCount: 5,
  highPriorityNearDeadline: [
    {
      id: 't-3',
      title: 'High Priority Task',
      dueDate: new Date('2025-01-20'),
      priority: 'HIGH',
      assignedTo: 'Bob',
    },
  ],
  riskLevel: 'high',
}

describe('DeadlineRiskPanel', () => {
  it('renders the title', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.getByText('Deadline Risk Analysis')).toBeInTheDocument()
    expect(screen.getByText('Tasks approaching deadlines')).toBeInTheDocument()
  })

  it('displays risk level badge', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.getByText('High Risk')).toBeInTheDocument()
  })

  it('shows medium risk badge', () => {
    const mediumRisk = { ...mockDeadlineRiskData, riskLevel: 'medium' as const }
    render(<DeadlineRiskPanel data={mediumRisk} />)
    expect(screen.getByText('Medium Risk')).toBeInTheDocument()
  })

  it('shows low risk badge', () => {
    const lowRisk = { ...mockDeadlineRiskData, riskLevel: 'low' as const }
    render(<DeadlineRiskPanel data={lowRisk} />)
    expect(screen.getByText('Low Risk')).toBeInTheDocument()
  })

  it('displays summary counts', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.getByText('Due in 3 Days')).toBeInTheDocument()
    expect(screen.getByText('Due in 7 Days')).toBeInTheDocument()
    expect(screen.getByText('High Priority')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renders urgent tasks list', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.getByText('Urgent Tasks (3 Days)')).toBeInTheDocument()
    expect(screen.getByText('Urgent Task Alpha')).toBeInTheDocument()
    expect(screen.getByText('Urgent Task Beta')).toBeInTheDocument()
  })

  it('shows assigned to info', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.getByText('Assigned to: Alice')).toBeInTheDocument()
  })

  it('shows priority badge for urgent tasks', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.getByText('URGENT')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('renders "+more" text when > 5 urgent tasks', () => {
    const manyTasks: DeadlineRisk = {
      ...mockDeadlineRiskData,
      dueIn3Days: Array.from({ length: 8 }, (_, i) => ({
        id: `t-${i}`,
        title: `Task ${i}`,
        dueDate: new Date('2025-01-16'),
        priority: 'HIGH',
        assignedTo: 'Alice',
      })),
    }
    render(<DeadlineRiskPanel data={manyTasks} />)
    expect(screen.getByText('+3 more urgent tasks')).toBeInTheDocument()
  })

  it('renders empty state when no urgent tasks', () => {
    const noUrgent: DeadlineRisk = {
      dueIn3Days: [],
      dueIn7DaysCount: 0,
      highPriorityNearDeadline: [],
      riskLevel: 'low',
    }
    render(<DeadlineRiskPanel data={noUrgent} />)
    expect(screen.getByText(/No urgent deadlines/)).toBeInTheDocument()
  })

  it('does not show empty state when there are high priority tasks', () => {
    const highOnly: DeadlineRisk = {
      dueIn3Days: [],
      dueIn7DaysCount: 3,
      highPriorityNearDeadline: [
        { id: 't-1', title: 'High Task', dueDate: new Date('2025-01-20'), priority: 'HIGH' },
      ],
      riskLevel: 'medium',
    }
    render(<DeadlineRiskPanel data={highOnly} />)
    expect(screen.queryByText(/No urgent deadlines/)).not.toBeInTheDocument()
  })

  it('hides assignedTo when not present', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.queryByText('Assigned to: Bob')).not.toBeInTheDocument()
  })
})
