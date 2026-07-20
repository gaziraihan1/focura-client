import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StorageResourcesSection } from '@/components/Dashboard/Analytics/WorkspaceUsage/StorageResourcesSection'

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

const mockResourceUsage = {
  totalStorage: { usedMB: 2500, totalMB: 5120, percentage: 49 },
  storageByProject: [
    { projectId: 'p1', projectName: 'Alpha', storageUsedMB: 1200, fileCount: 80, percentage: 48 },
  ],
  filesByUser: [
    { userId: 'u1', userName: 'Alice', userEmail: 'alice@test.com', fileCount: 50, storageUsedMB: 1500 },
  ],
}

describe('StorageResourcesSection', () => {
  it('renders section heading', () => {
    render(<StorageResourcesSection resourceUsage={mockResourceUsage as any as Record<string, unknown>} />)
    expect(screen.getByText('Storage & Resources')).toBeInTheDocument()
  })

  it('renders storage usage card with percentage', () => {
    render(<StorageResourcesSection resourceUsage={mockResourceUsage as any as Record<string, unknown>} />)
    expect(screen.getByText('Storage Usage')).toBeInTheDocument()
    expect(screen.getByText('49%')).toBeInTheDocument()
  })

  it('renders total files card', () => {
    render(<StorageResourcesSection resourceUsage={mockResourceUsage as any as Record<string, unknown>} />)
    expect(screen.getByText('Total Files')).toBeInTheDocument()
  })

  it('shows critical alert when storage >= 90%', () => {
    const critical = {
      ...mockResourceUsage,
      totalStorage: { usedMB: 4800, totalMB: 5120, percentage: 94 },
    }
    render(<StorageResourcesSection resourceUsage={critical as any as Record<string, unknown>} />)
    expect(screen.getByText(/Storage Critical/)).toBeInTheDocument()
  })
})
