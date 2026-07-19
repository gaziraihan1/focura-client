import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskSearchAndFilters } from '@/components/Dashboard/AllTasks/WorkspaceTasks/TaskSearchAndFilters'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: any) => <svg data-testid={name} {...props} />
  return {
    Search: icon('Search'),
    Filter: icon('Filter'),
    ArrowUpDown: icon('ArrowUpDown'),
    ArrowUp: icon('ArrowUp'),
    ArrowDown: icon('ArrowDown'),
    X: icon('X'),
  }
})

const defaultProps = {
  searchQuery: '',
  onSearchChange: vi.fn(),
  showFilters: false,
  onToggleFilters: vi.fn(),
  activeFiltersCount: 0,
  sortBy: 'dueDate' as const,
  onSortChange: vi.fn(),
  selectedStatus: 'all',
  onStatusChange: vi.fn(),
  selectedPriority: 'all',
  onPriorityChange: vi.fn(),
  selectedProject: 'all',
  onProjectChange: vi.fn(),
  selectedAssignee: 'all',
  onAssigneeChange: vi.fn(),
  selectedLabels: [],
  onToggleLabel: vi.fn(),
  onClearFilters: vi.fn(),
  projects: [],
  labels: [],
  members: [],
}

describe('TaskSearchAndFilters', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders search input', () => {
    render(<TaskSearchAndFilters {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument()
  })

  it('calls onSearchChange when typing', () => {
    render(<TaskSearchAndFilters {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText('Search tasks...'), { target: { value: 'hello' } })
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('hello')
  })

  it('calls onToggleFilters when filter button clicked', () => {
    render(<TaskSearchAndFilters {...defaultProps} />)
    fireEvent.click(screen.getByText('Filters'))
    expect(defaultProps.onToggleFilters).toHaveBeenCalled()
  })

  it('shows filter count badge when activeFiltersCount > 0', () => {
    render(<TaskSearchAndFilters {...defaultProps} activeFiltersCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
