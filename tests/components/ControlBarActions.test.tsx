import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ControlBarActions } from '@/components/Dashboard/KanbanView/ExecutionControlBar/ControlBarActions'

const defaultProps = {
  showFilters: false,
  activeFilterCount: 0,
  filters: { priority: [] as string[], blockedOnly: false, staleOnly: false },
  sort: 'priority' as const,
  enforceWIP: false,
  onToggleFilters: vi.fn(),
  onSortChange: vi.fn(),
  onToggleBlockedOnly: vi.fn(),
  onToggleStaleOnly: vi.fn(),
  onEnforceWIPChange: vi.fn(),
}

describe('ControlBarActions', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders Filters button', () => {
    render(<ControlBarActions {...defaultProps} />)
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('renders Sort dropdown with current sort', () => {
    render(<ControlBarActions {...defaultProps} />)
    expect(screen.getByText('Sort:')).toBeInTheDocument()
    // "priority" appears in both button and dropdown
    const priorities = screen.getAllByText('priority')
    expect(priorities.length).toBeGreaterThanOrEqual(1)
  })

  it('renders WIP toggle', () => {
    render(<ControlBarActions {...defaultProps} />)
    expect(screen.getByText('Enforce WIP limits')).toBeInTheDocument()
  })

  it('shows active filter count', () => {
    render(<ControlBarActions {...defaultProps} activeFilterCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls onToggleFilters when filters button is clicked', () => {
    render(<ControlBarActions {...defaultProps} />)
    fireEvent.click(screen.getByText('Filters'))
    expect(defaultProps.onToggleFilters).toHaveBeenCalled()
  })

  it('calls onEnforceWIPChange when WIP checkbox is clicked', () => {
    render(<ControlBarActions {...defaultProps} />)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(defaultProps.onEnforceWIPChange).toHaveBeenCalledWith(true)
  })
})
