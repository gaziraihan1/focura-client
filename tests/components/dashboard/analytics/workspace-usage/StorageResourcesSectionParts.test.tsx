import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  StorageBar,
  StorageUsageCard,
  TotalFilesCard,
  FileTypeDistribution,
} from '@/components/dashboard/analytics/WorkspaceUsage/StorageResourcesSectionParts'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  PieChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}))

const mockTotalStorage = { usedMB: 2048, totalMB: 5120, percentage: 40 }

const mockTrend = [
  { month: 'Jan', count: 5 },
  { month: 'Feb', count: 8 },
  { month: 'Mar', count: 12 },
  { month: 'Apr', count: 15 },
  { month: 'May', count: 20 },
  { month: 'Jun', count: 25 },
]

const mockFileTypes = [
  { name: 'Images', value: 30 },
  { name: 'PDFs', value: 20 },
  { name: 'Docs', value: 15 },
]

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

  it('TotalFilesCard shows total count and real growth pct', () => {
    render(<TotalFilesCard totalFiles={1234} trend={mockTrend} growthPct={25} />)
    expect(screen.getByText('1234')).toBeInTheDocument()
    expect(screen.getByText('+25% this month')).toBeInTheDocument()
  })

  it('TotalFilesCard hides the growth badge when there is no baseline', () => {
    render(<TotalFilesCard totalFiles={1234} trend={mockTrend} growthPct={null} />)
    expect(screen.getByText('No uploads in the previous month')).toBeInTheDocument()
    expect(screen.queryByText(/this month$/)).not.toBeInTheDocument()
  })

  it('FileTypeDistribution renders real file type entries', () => {
    render(<FileTypeDistribution data={mockFileTypes} />)
    expect(screen.getByText('Images')).toBeInTheDocument()
    expect(screen.getByText('PDFs')).toBeInTheDocument()
    expect(screen.getByText('Docs')).toBeInTheDocument()
  })

  it('FileTypeDistribution shows empty state when there are no files', () => {
    render(<FileTypeDistribution data={[]} />)
    expect(screen.getByText(/No files uploaded yet/)).toBeInTheDocument()
  })
})
