import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StorageTrendChart } from '@/components/Dashboard/Storage/StorageTrendChart'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}))

vi.mock('lucide-react', () => ({
  TrendingUp: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="trending-up" {...props} />,
}))

vi.mock('@/hooks/useStoragePage', () => ({
  formatStorageSize: (mb: number) => `${mb} MB`,
}))

const trend = [
  { date: new Date('2025-01-01'), usageMB: 100 },
  { date: new Date('2025-01-15'), usageMB: 200 },
  { date: new Date('2025-02-01'), usageMB: 300 },
]

describe('StorageTrendChart', () => {
  it('renders the heading', () => {
    render(<StorageTrendChart trend={trend} />)
    expect(screen.getByText('Storage Trend')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<StorageTrendChart trend={trend} />)
    expect(screen.getByText('Last 30 days')).toBeInTheDocument()
  })

  it('renders current and 30 days ago values', () => {
    render(<StorageTrendChart trend={trend} />)
    expect(screen.getByText('Current')).toBeInTheDocument()
    expect(screen.getByText('30 Days Ago')).toBeInTheDocument()
  })

  it('renders the trend percentage', () => {
    render(<StorageTrendChart trend={trend} />)
    expect(screen.getByText('+200%')).toBeInTheDocument()
  })
})
