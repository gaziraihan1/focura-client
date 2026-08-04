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
    LayoutGrid: mock('layout-grid'),
  }
})

import { ProjectStatusChart } from '@/components/Dashboard/Workspaces/Analytics/ProjectStatusChart'
import type { ProjectStatusItem } from '@/hooks/useAnalytics'

const mockData: ProjectStatusItem[] = [
  { status: 'ACTIVE', count: 5 },
  { status: 'PLANNING', count: 3 },
  { status: 'ON_HOLD', count: 2 },
]

describe('ProjectStatusChart', () => {
  it('renders the chart title', () => {
    render(<ProjectStatusChart data={mockData} />)
    expect(screen.getByText('Project Status')).toBeInTheDocument()
  })

  it('renders all status legend items', () => {
    render(<ProjectStatusChart data={mockData} />)
    expect(screen.getByText('active')).toBeInTheDocument()
    expect(screen.getByText('planning')).toBeInTheDocument()
    expect(screen.getByText('on hold')).toBeInTheDocument()
  })

  it('displays counts and percentages', () => {
    render(<ProjectStatusChart data={mockData} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
  })

  it('shows the total project count', () => {
    render(<ProjectStatusChart data={mockData} />)
    expect(screen.getByText('Total Projects')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders with a single status item', () => {
    const singleData: ProjectStatusItem[] = [{ status: 'ARCHIVED', count: 2 }]
    render(<ProjectStatusChart data={singleData} />)
    expect(screen.getByText('archived')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    render(<ProjectStatusChart data={[]} />)
    expect(screen.getByText('No project status data available')).toBeInTheDocument()
  })
})
