import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WorkspaceUsageHeader } from '@/components/Dashboard/Analytics/WorkspaceUsage/WorkspaceUsageHeader'

vi.mock('@/hooks/useWorkspaceUsage', () => ({
  useExportWorkspaceUsage: () => ({
    exportToCSV: vi.fn().mockResolvedValue(undefined),
  }),
}))

const defaultProps = {
  dateRange: '7d' as const,
  onDateRangeChange: vi.fn(),
  workspaceId: 'ws-1',
  isRefreshing: false,
  onRefresh: vi.fn(),
}

describe('WorkspaceUsageHeader', () => {
  it('renders title and subtitle', () => {
    render(<WorkspaceUsageHeader {...defaultProps} />)
    expect(screen.getByText('Workspace Usage')).toBeInTheDocument()
    expect(screen.getByText('Engagement & resource consumption overview')).toBeInTheDocument()
  })

  it('renders all date range pills', () => {
    render(<WorkspaceUsageHeader {...defaultProps} />)
    expect(screen.getByText('7d')).toBeInTheDocument()
    expect(screen.getByText('30d')).toBeInTheDocument()
    expect(screen.getByText('90d')).toBeInTheDocument()
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  it('calls onDateRangeChange when a pill is clicked', () => {
    const onChange = vi.fn()
    render(<WorkspaceUsageHeader {...defaultProps} onDateRangeChange={onChange} />)
    fireEvent.click(screen.getByText('30d'))
    expect(onChange).toHaveBeenCalledWith('30d')
  })

  it('renders export button', () => {
    render(<WorkspaceUsageHeader {...defaultProps} />)
    expect(screen.getByText('Export CSV')).toBeInTheDocument()
  })

  it('renders refresh button when onRefresh is provided', () => {
    render(<WorkspaceUsageHeader {...defaultProps} />)
    expect(screen.getByText('Refresh')).toBeInTheDocument()
  })

  it('shows spinning icon when refreshing', () => {
    render(<WorkspaceUsageHeader {...defaultProps} isRefreshing={true} />)
    const refreshIcon = screen.getByLabelText('Refreshing data')
    expect(refreshIcon).toBeInTheDocument()
  })
})
