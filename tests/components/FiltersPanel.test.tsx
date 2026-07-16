import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FiltersPanel } from '@/components/Dashboard/KanbanView/ExecutionControlBar/FiltersPanel'

const defaultProps = {
  filters: { priority: [] as string[], blockedOnly: false, staleOnly: false },
  onTogglePriority: vi.fn(),
  onClearFilters: vi.fn(),
}

describe('FiltersPanel', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders priority filter buttons', () => {
    render(<FiltersPanel {...defaultProps} />)
    expect(screen.getByText('URGENT')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
    expect(screen.getByText('LOW')).toBeInTheDocument()
  })

  it('renders clear filters button', () => {
    render(<FiltersPanel {...defaultProps} />)
    expect(screen.getByText('Clear filters')).toBeInTheDocument()
  })

  it('calls onClearFilters when clear button is clicked', () => {
    render(<FiltersPanel {...defaultProps} />)
    fireEvent.click(screen.getByText('Clear filters'))
    expect(defaultProps.onClearFilters).toHaveBeenCalled()
  })

  it('calls onTogglePriority when priority is clicked', () => {
    render(<FiltersPanel {...defaultProps} />)
    fireEvent.click(screen.getByText('HIGH'))
    expect(defaultProps.onTogglePriority).toHaveBeenCalledWith('HIGH')
  })

  it('highlights active priorities with correct color', () => {
    render(
      <FiltersPanel
        {...defaultProps}
        filters={{ priority: ['HIGH', 'URGENT'], blockedOnly: false, staleOnly: false }}
      />
    )
    const highBtn = screen.getByText('HIGH').closest('button')!
    const urgentBtn = screen.getByText('URGENT').closest('button')!
    expect(highBtn).toHaveClass('bg-orange-500')
    expect(urgentBtn).toHaveClass('bg-red-500')
  })
})
