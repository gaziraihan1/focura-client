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
    AlertCircle: mock('alert-circle'),
  }
})

import { OverdueTrendChart } from '@/components/Dashboard/Workspaces/Analytics/OverdueTrendChart'
import type { OverdueTrendPoint } from '@/hooks/useAnalytics'

const mockData: OverdueTrendPoint[] = [
  { weekStart: new Date('2025-01-01'), count: 2 },
  { weekStart: new Date('2025-01-08'), count: 5 },
  { weekStart: new Date('2025-01-15'), count: 3 },
]

describe('OverdueTrendChart', () => {
  it('renders the chart title', () => {
    render(<OverdueTrendChart data={mockData} />)
    expect(screen.getByText('Overdue Trend')).toBeInTheDocument()
  })

  it('shows the total overdue count badge', () => {
    render(<OverdueTrendChart data={mockData} />)
    expect(screen.getByText('10 overdue')).toBeInTheDocument()
  })

  it('renders bars for each data point', () => {
    const { container } = render(<OverdueTrendChart data={mockData} />)
    const bars = container.querySelectorAll('.group.relative.flex-1')
    expect(bars.length).toBe(3)
  })

  it('renders empty state when no data', () => {
    render(<OverdueTrendChart data={[]} />)
    expect(screen.getByText('No overdue data available')).toBeInTheDocument()
  })

  it('renders with a single data point', () => {
    const singleData: OverdueTrendPoint[] = [{ weekStart: new Date('2025-01-01'), count: 1 }]
    render(<OverdueTrendChart data={singleData} />)
    expect(screen.getByText('1 overdue')).toBeInTheDocument()
  })

  it('handles weekStart as an ISO string (JSON-serialized API payload)', () => {
    const stringData: OverdueTrendPoint[] = [
      { weekStart: '2025-01-01T00:00:00.000Z', count: 2 },
      { weekStart: '2025-01-08T00:00:00.000Z', count: 5 },
    ]
    const { container } = render(<OverdueTrendChart data={stringData} />)
    expect(screen.getByText('7 overdue')).toBeInTheDocument()
    const bars = container.querySelectorAll('.group.relative.flex-1')
    expect(bars.length).toBe(2)
  })
})
