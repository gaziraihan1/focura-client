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

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  BarChart: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="bar-chart" {...props} />,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
}))

import { ActivityTrendChart } from '@/components/Dashboard/Workspaces/Analytics/ActivityTrendChart'
import type { ActivityTrendPoint } from '@/hooks/useAnalytics'

const mockActivityTrendData: ActivityTrendPoint[] = [
  { date: new Date('2025-01-01'), created: 5, updated: 3, completed: 2, assigned: 1, total: 11 },
  { date: new Date('2025-01-02'), created: 8, updated: 4, completed: 3, assigned: 2, total: 17 },
  { date: new Date('2025-01-03'), created: 3, updated: 6, completed: 1, assigned: 0, total: 10 },
]

describe('ActivityTrendChart', () => {
  it('renders chart with data', () => {
    render(<ActivityTrendChart data={mockActivityTrendData} />)
    expect(screen.getByText('Activity Volume Trend')).toBeInTheDocument()
    expect(screen.getByText('Team activity over the last 30 days')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    render(<ActivityTrendChart data={[]} />)
    expect(screen.getByText('No activity data available')).toBeInTheDocument()
  })

  it('shows legend categories', () => {
    render(<ActivityTrendChart data={mockActivityTrendData} />)
    expect(screen.getByText('Created')).toBeInTheDocument()
    expect(screen.getByText('Updated')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Assigned')).toBeInTheDocument()
  })

  it('displays summed legend values', () => {
    render(<ActivityTrendChart data={mockActivityTrendData} />)
    const createdLegend = screen.getAllByText('16')
    expect(createdLegend.length).toBeGreaterThan(0)
    const updatedLegend = screen.getAllByText('13')
    expect(updatedLegend.length).toBeGreaterThan(0)
    const completedLegend = screen.getAllByText('6')
    expect(completedLegend.length).toBeGreaterThan(0)
  })

  it('renders stacked bar segments', () => {
    const { container } = render(<ActivityTrendChart data={mockActivityTrendData} />)
    const bars = container.querySelectorAll('.flex-1')
    expect(bars.length).toBeGreaterThan(0)
  })

  it('renders with data where total is 0', () => {
    const zeroData: ActivityTrendPoint[] = [
      { date: new Date('2025-01-01'), created: 0, updated: 0, completed: 0, assigned: 0, total: 0 },
    ]
    render(<ActivityTrendChart data={zeroData} />)
    expect(screen.getByText('Activity Volume Trend')).toBeInTheDocument()
  })
})
