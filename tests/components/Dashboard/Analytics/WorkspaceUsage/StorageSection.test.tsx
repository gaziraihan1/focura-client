import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StorageSection } from '@/components/Dashboard/Analytics/WorkspaceUsage/StorageSection'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  PieChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
}))

const mockResourceUsage = {
  totalStorage: { usedMB: 512, totalMB: 2048, percentage: 25 },
  storageByProject: [
    { projectId: 'p1', projectName: 'Project A', storageUsedMB: 200, fileCount: 45, percentage: 39 },
    { projectId: 'p2', projectName: 'Project B', storageUsedMB: 150, fileCount: 30, percentage: 29 },
  ],
  filesByUser: [
    { userId: 'u1', userName: 'Alice', userEmail: 'alice@test.com', fileCount: 25, storageUsedMB: 300 },
  ],
}

describe('StorageSection', () => {
  it('renders section heading', () => {
    render(<StorageSection resourceUsage={mockResourceUsage as any as Record<string, unknown>} />)
    expect(screen.getByText('Storage & Resources')).toBeInTheDocument()
  })

  it('renders storage used card', () => {
    render(<StorageSection resourceUsage={mockResourceUsage as any as Record<string, unknown>} />)
    expect(screen.getByText('Storage Used')).toBeInTheDocument()
  })

  it('renders file count card', () => {
    render(<StorageSection resourceUsage={mockResourceUsage as any as Record<string, unknown>} />)
    expect(screen.getByText('Total Files')).toBeInTheDocument()
  })

  it('shows warning banner when storage is near limit', () => {
    const nearLimit = {
      ...mockResourceUsage,
      totalStorage: { usedMB: 1900, totalMB: 2048, percentage: 93 },
    }
    render(<StorageSection resourceUsage={nearLimit as any as Record<string, unknown>} />)
    expect(screen.getByText(/Storage usage is high/)).toBeInTheDocument()
  })
})
