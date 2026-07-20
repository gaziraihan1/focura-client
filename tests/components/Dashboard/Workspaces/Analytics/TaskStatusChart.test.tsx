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
    BarChart3: mock('bar-chart3'),
  }
})

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  PieChart: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="pie-chart" {...props} />,
  Pie: () => null,
  Cell: () => null,
}))

import { TaskStatusChart } from '@/components/Dashboard/Workspaces/Analytics/TaskStatusChart'
import type { TaskStatusItem } from '@/hooks/useAnalytics'

const mockTaskStatusData: TaskStatusItem[] = [
  { status: 'TODO', count: 20, percentage: 20 },
  { status: 'IN_PROGRESS', count: 15, percentage: 15 },
  { status: 'COMPLETED', count: 50, percentage: 50 },
  { status: 'BLOCKED', count: 5, percentage: 5 },
  { status: 'IN_REVIEW', count: 10, percentage: 10 },
]

describe('TaskStatusChart', () => {
  it('renders the chart title', () => {
    render(<TaskStatusChart data={mockTaskStatusData} />)
    expect(screen.getByText('Task Status Distribution')).toBeInTheDocument()
  })

  it('displays total task count', () => {
    render(<TaskStatusChart data={mockTaskStatusData} />)
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
  })

  it('renders all status legend items', () => {
    render(<TaskStatusChart data={mockTaskStatusData} />)
    expect(screen.getByText('todo')).toBeInTheDocument()
    expect(screen.getByText('in progress')).toBeInTheDocument()
    expect(screen.getByText('completed')).toBeInTheDocument()
    expect(screen.getByText('blocked')).toBeInTheDocument()
    expect(screen.getByText('in review')).toBeInTheDocument()
  })

  it('displays count and percentage for each status', () => {
    render(<TaskStatusChart data={mockTaskStatusData} />)
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('(20%)')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('(50%)')).toBeInTheDocument()
  })

  it('renders with single status item', () => {
    const singleData: TaskStatusItem[] = [
      { status: 'COMPLETED', count: 10, percentage: 100 },
    ]
    render(<TaskStatusChart data={singleData} />)
    expect(screen.getByText('completed')).toBeInTheDocument()
    expect(screen.getByText('(100%)')).toBeInTheDocument()
  })

  it('renders with empty data', () => {
    render(<TaskStatusChart data={[]} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
