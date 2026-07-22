import React from 'react'
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

  const mock = (name: string) => {
    const Cmp = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    Cmp.displayName = name
    return Cmp
  }
  return {
    TrendingUp: mock('trending-up'),
    ArrowUp: mock('arrow-up'),
    ArrowDown: mock('arrow-down'),
  }
})

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  BarChart: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="bar-chart" {...props} />,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
}))

import { TaskCompletionTrend } from '@/components/Dashboard/Workspaces/Analytics/TaskCompletionTrend'
import type { TrendDataPoint } from '@/hooks/useAnalytics'

const mockCompletionTrendData: TrendDataPoint[] = [
  { date: new Date('2025-01-01'), count: 5 },
  { date: new Date('2025-01-02'), count: 8 },
  { date: new Date('2025-01-03'), count: 12 },
  { date: new Date('2025-01-04'), count: 15 },
  { date: new Date('2025-01-05'), count: 10 },
]

describe('TaskCompletionTrend', () => {
  it('renders the chart title', () => {
    render(<TaskCompletionTrend data={mockCompletionTrendData} />)
    expect(screen.getByText('Task Completion Trend')).toBeInTheDocument()
    expect(screen.getByText('Last 30 days')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    render(<TaskCompletionTrend data={[]} />)
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('shows trend direction as up when last > first', () => {
    const upTrend: TrendDataPoint[] = [
      { date: new Date('2025-01-01'), count: 5 },
      { date: new Date('2025-01-02'), count: 15 },
    ]
    render(<TaskCompletionTrend data={upTrend} />)
    expect(screen.getByText('+200%')).toBeInTheDocument()
  })

  it('shows trend direction as down when last < first', () => {
    const downTrend: TrendDataPoint[] = [
      { date: new Date('2025-01-01'), count: 15 },
      { date: new Date('2025-01-02'), count: 5 },
    ]
    render(<TaskCompletionTrend data={downTrend} />)
    expect(screen.getByText('-67%')).toBeInTheDocument()
  })

  it('shows stable trend when last === first', () => {
    const stableTrend: TrendDataPoint[] = [
      { date: new Date('2025-01-01'), count: 10 },
      { date: new Date('2025-01-02'), count: 10 },
    ]
    render(<TaskCompletionTrend data={stableTrend} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('renders x-axis labels', () => {
    render(<TaskCompletionTrend data={mockCompletionTrendData} />)
    const dateLabels = screen.getAllByText(/Jan/)
    expect(dateLabels.length).toBeGreaterThanOrEqual(3)
  })

  it('handles first value being 0', () => {
    const zeroFirst: TrendDataPoint[] = [
      { date: new Date('2025-01-01'), count: 0 },
      { date: new Date('2025-01-02'), count: 10 },
    ]
    render(<TaskCompletionTrend data={zeroFirst} />)
    expect(screen.getByText('+0%')).toBeInTheDocument()
  })

  it('renders bar chart elements', () => {
    render(<TaskCompletionTrend data={mockCompletionTrendData} />)
    expect(screen.getByText('Task Completion Trend')).toBeInTheDocument()
  })
})
