import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
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
    focusRequired: false,
    onFocusRequiredChange: vi.fn(),
  }

  it('renders all tab buttons', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByRole('button', { name: /all tasks/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /personal/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /assigned/i })).toBeInTheDocument()
  })

  it('calls onTabChange when tab clicked', async () => {
    const user = userEvent.setup()
    const onTabChange = vi.fn()
    render(<TaskFiltersBar {...defaultProps} onTabChange={onTabChange} />)
    await user.click(screen.getByRole('button', { name: /personal/i }))
    expect(onTabChange).toHaveBeenCalledWith('personal')
  })

  it('renders search input', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument()
  })

  it('renders status and priority selects', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByDisplayValue('All Status')).toBeInTheDocument()
    expect(screen.getByDisplayValue('All Priority')).toBeInTheDocument()
  })

  it('calls onFocusRequiredChange when Focus Needed button clicked', async () => {
    const user = userEvent.setup()
    const onFocusRequiredChange = vi.fn()
    render(<TaskFiltersBar {...defaultProps} onFocusRequiredChange={onFocusRequiredChange} />)
    await user.click(screen.getByRole('button', { name: /focus needed/i }))
    expect(onFocusRequiredChange).toHaveBeenCalledWith(true)
  })
})
