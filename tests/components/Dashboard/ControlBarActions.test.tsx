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

  it('renders the sort trigger showing the current sort', () => {
    render(<ControlBarActions {...defaultProps} />)
    expect(screen.getByRole('button', { name: /priority/i })).toBeInTheDocument()
  })

  it('opens the sort dropdown on click and applies a selection', () => {
    render(<ControlBarActions {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /priority/i }))

    const recent = screen.getByRole('button', { name: /recent/i })
    expect(recent).toBeInTheDocument()
    fireEvent.click(recent)

    expect(defaultProps.onSortChange).toHaveBeenCalledWith('recent')
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
