import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  StorageBar,
  StorageUsageCard,
  TotalFilesCard,
  StorageGrowthChart,
  FileTypeDistribution,
} from '@/components/Dashboard/Analytics/WorkspaceUsage/StorageResourcesSectionParts'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}))

const mockTotalStorage = { usedMB: 2048, totalMB: 5120, percentage: 40 }

describe('StorageResourcesSectionParts', () => {
  it('StorageBar renders with correct width', () => {
    const { container } = render(<StorageBar percentage={65} />)
    const bar = container.querySelector('[style*="width"]')
    expect(bar).toHaveStyle({ width: '65%' })
  })

  it('StorageUsageCard displays percentage', () => {
    render(<StorageUsageCard totalStorage={mockTotalStorage} isCritical={false} isWarning={false} />)
    expect(screen.getByText('40%')).toBeInTheDocument()
  })

  it('TotalFilesCard shows total count', () => {
    render(<TotalFilesCard totalFiles={1234} />)
    expect(screen.getByText('1234')).toBeInTheDocument()
  })

  it('FileTypeDistribution renders file type entries', () => {
    render(<FileTypeDistribution />)
    expect(screen.getByText('Images')).toBeInTheDocument()
    expect(screen.getByText('PDFs')).toBeInTheDocument()
    expect(screen.getByText('Videos')).toBeInTheDocument()
  })
})
