import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/dashboard/workspaces/test-ws/projects/test-proj/tasks',
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('lucide-react', () => {
  const React = require('react')
  const mock = (name: string) => {
    const Cmp = (props: any) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    Cmp.displayName = name
    return Cmp
  }
  return {
    Search: mock('search'),
    ArrowUpDown: mock('arrow-up-down'),
    ArrowUp: mock('arrow-up'),
    ArrowDown: mock('arrow-down'),
  }
})

import { TaskFiltersBar } from '@/components/Dashboard/AllTasks/TaskFiltersBar'

describe('TaskFiltersBar', () => {
  const defaultProps = {
    activeTab: 'all' as const,
    onTabChange: vi.fn(),
    searchQuery: '',
    onSearchChange: vi.fn(),
    selectedStatus: 'all',
    onStatusChange: vi.fn(),
    selectedPriority: 'all',
    onPriorityChange: vi.fn(),
    sortBy: 'createdAt' as const,
    sortOrder: undefined as 'asc' | 'desc' | undefined,
    onSortChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all tab buttons', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByText('All Tasks')).toBeInTheDocument()
    expect(screen.getByText('Personal')).toBeInTheDocument()
    expect(screen.getByText('Assigned')).toBeInTheDocument()
  })

  it('calls onTabChange when tab clicked', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    fireEvent.click(screen.getByText('Personal'))
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('personal')
  })

  it('renders search input', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument()
  })

  it('calls onSearchChange when typing', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    const input = screen.getByPlaceholderText('Search tasks...')
    fireEvent.change(input, { target: { value: 'test query' } })
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test query')
  })

  it('renders status dropdown', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByText('All Status')).toBeInTheDocument()
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('In Review')).toBeInTheDocument()
    expect(screen.getByText('Blocked')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('calls onStatusChange when status changed', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    const statusSelect = screen.getByDisplayValue('All Status')
    fireEvent.change(statusSelect, { target: { value: 'TODO' } })
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith('TODO')
  })

  it('renders priority dropdown', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByText('All Priority')).toBeInTheDocument()
    expect(screen.getByText('Urgent')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('calls onPriorityChange when priority changed', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    const prioritySelect = screen.getByDisplayValue('All Priority')
    fireEvent.change(prioritySelect, { target: { value: 'URGENT' } })
    expect(defaultProps.onPriorityChange).toHaveBeenCalledWith('URGENT')
  })

  it('renders sort dropdown', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByDisplayValue('Created Date')).toBeInTheDocument()
  })

  it('calls onSortChange when sort changed', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    const sortSelect = screen.getByDisplayValue('Created Date')
    fireEvent.change(sortSelect, { target: { value: 'priority' } })
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('priority')
  })

  it('shows ArrowUpDown icon when no sortOrder', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByTestId('arrow-up-down-icon')).toBeInTheDocument()
  })

  it('shows ArrowUp icon when sortOrder is asc', () => {
    render(<TaskFiltersBar {...defaultProps} sortOrder="asc" />)
    expect(screen.getByTestId('arrow-up-icon')).toBeInTheDocument()
  })

  it('shows ArrowDown icon when sortOrder is desc', () => {
    render(<TaskFiltersBar {...defaultProps} sortOrder="desc" />)
    expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument()
  })

  it('shows search icon', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
  })
})
