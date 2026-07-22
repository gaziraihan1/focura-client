import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ExecutionControlBar } from '@/components/Dashboard/KanbanView/ExecutionControlBar'

vi.mock('@/hooks/useKanbanPage', () => ({
  useExecutionControlBar: vi.fn(() => ({
    showFilters: false,
    activeFilterCount: 0,
    togglePriority: vi.fn(),
    toggleBlockedOnly: vi.fn(),
    toggleStaleOnly: vi.fn(),
    clearFilters: vi.fn(),
    toggleFiltersPanel: vi.fn(),
  })),
}))

const defaultProps = {
  filters: { priority: [], blockedOnly: false, staleOnly: false },
  onFiltersChange: vi.fn(),
  sort: 'priority' as const,
  onSortChange: vi.fn(),
  enforceWIP: false,
  onEnforceWIPChange: vi.fn(),
  focusMode: false,
}

describe('ExecutionControlBar', () => {
  it('renders the control bar with Filters', () => {
    render(<ExecutionControlBar {...defaultProps} />)
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('renders sort dropdown', () => {
    render(<ExecutionControlBar {...defaultProps} />)
    expect(screen.getByText('Sort:')).toBeInTheDocument()
  })

  it('renders WIP toggle', () => {
    render(<ExecutionControlBar {...defaultProps} />)
    expect(screen.getByText('Enforce WIP limits')).toBeInTheDocument()
  })
})
