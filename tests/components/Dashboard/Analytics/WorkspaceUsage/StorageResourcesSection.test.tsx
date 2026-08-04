import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StorageResourcesSection } from '@/components/Dashboard/Analytics/WorkspaceUsage/StorageResourcesSection'
import type { ResourceUsageMetrics } from '@/types/workspace-usage.types'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  BarChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  PieChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}))

const mockResourceUsage: ResourceUsageMetrics = {
  totalStorage: { usedMB: 2500, totalMB: 5120, percentage: 49 },
  storageByProject: [
    { projectId: 'p1', projectName: 'Alpha', storageUsedMB: 1200, fileCount: 80, percentage: 48 },
  ],
  filesByUser: [
    { userId: 'u1', userName: 'Alice', userEmail: 'alice@test.com', fileCount: 50, storageUsedMB: 1500 },
  ],
  storageGrowth: [
    { month: 'Jan', storage: 100 },
    { month: 'Feb', storage: 200 },
    { month: 'Mar', storage: 300 },
    { month: 'Apr', storage: 400 },
    { month: 'May', storage: 500 },
    { month: 'Jun', storage: 600 },
  ],
  fileTrend: [
    { month: 'Jan', count: 5 },
    { month: 'Feb', count: 8 },
    { month: 'Mar', count: 12 },
    { month: 'Apr', count: 15 },
    { month: 'May', count: 20 },
    { month: 'Jun', count: 25 },
  ],
  fileGrowthPct: 25,
  fileTypeDistribution: [
    { name: 'Images', value: 30 },
    { name: 'PDFs', value: 20 },
    { name: 'Docs', value: 15 },
  ],
}

describe('StorageResourcesSection', () => {
  it('renders section heading', () => {
    render(<StorageResourcesSection resourceUsage={mockResourceUsage} />)
    expect(screen.getByText('Storage & Resources')).toBeInTheDocument()
  })

  it('renders storage usage card with percentage', () => {
    render(<StorageResourcesSection resourceUsage={mockResourceUsage} />)
    expect(screen.getByText('Storage Usage')).toBeInTheDocument()
    expect(screen.getByText('49%')).toBeInTheDocument()
  })

  it('renders total files card', () => {
    render(<StorageResourcesSection resourceUsage={mockResourceUsage} />)
    expect(screen.getByText('Total Files')).toBeInTheDocument()
  })

  it('renders file-type distribution from real data', () => {
    render(<StorageResourcesSection resourceUsage={mockResourceUsage} />)
    expect(screen.getByText('Images')).toBeInTheDocument()
    expect(screen.getByText('PDFs')).toBeInTheDocument()
    expect(screen.getByText('Docs')).toBeInTheDocument()
  })

  it('shows critical alert when storage >= 90%', () => {
    const critical = {
      ...mockResourceUsage,
      totalStorage: { usedMB: 4800, totalMB: 5120, percentage: 94 },
    }
    render(<StorageResourcesSection resourceUsage={critical} />)
    expect(screen.getByText(/Storage Critical/)).toBeInTheDocument()
  })
})
