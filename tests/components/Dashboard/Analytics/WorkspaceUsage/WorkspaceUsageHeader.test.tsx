import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WorkspaceUsageHeader } from '@/components/Dashboard/Analytics/WorkspaceUsage/WorkspaceUsageHeader'

const defaultProps = {
  dateRange: '7d' as const,
  onDateRangeChange: vi.fn(),
  onExport: vi.fn(),
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

  it('calls onExport when export button is clicked', () => {
    const onExport = vi.fn()
    render(<WorkspaceUsageHeader {...defaultProps} onExport={onExport} />)
    fireEvent.click(screen.getByText('Export CSV'))
    expect(onExport).toHaveBeenCalledTimes(1)
  })
})
