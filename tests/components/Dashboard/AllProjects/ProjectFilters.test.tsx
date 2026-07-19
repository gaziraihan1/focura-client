import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectFilters } from '@/components/Dashboard/AllProjects/ProjectFilters'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: any) => <svg data-testid={name} {...props} />
  return {
    Search: icon('Search'),
    Filter: icon('Filter'),
    Grid3x3: icon('Grid3x3'),
    List: icon('List'),
  }
})

const defaultProps = {
  searchQuery: '',
  onSearchChange: vi.fn(),
  showFilters: false,
  onToggleFilters: vi.fn(),
  filters: { status: 'all', priority: 'all', workspace: 'all' },
  onFiltersChange: vi.fn(),
  activeFiltersCount: 0,
  viewMode: 'grid' as const,
  onViewModeChange: vi.fn(),
  workspaces: [{ id: 'ws-1', name: 'Workspace A', slug: 'ws-a' } as any],
}

describe('ProjectFilters', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders search input', () => {
    render(<ProjectFilters {...defaultProps} />)
    expect(screen.getByPlaceholderText(/Search projects/)).toBeInTheDocument()
  })

  it('calls onSearchChange when typing', () => {
    render(<ProjectFilters {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText(/Search projects/), { target: { value: 'test' } })
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test')
  })

  it('shows active filter count badge', () => {
    render(<ProjectFilters {...defaultProps} activeFiltersCount={2} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
