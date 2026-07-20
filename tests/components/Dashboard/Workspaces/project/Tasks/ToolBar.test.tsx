import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Toolbar } from '@/components/Dashboard/Workspaces/project/Tasks/ToolBar'

vi.mock('lucide-react', () => ({
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="chevron" {...props} />,
  Filter: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="filter" {...props} />,
  LayoutGrid: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="layout-grid" {...props} />,
  List: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="list" {...props} />,
  Search: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="search" {...props} />,
  SlidersHorizontal: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="sliders" {...props} />,
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x" {...props} />,
}))

vi.mock('@/components/Dashboard/Workspaces/project/Tasks/PriorityBadge', () => ({
  PRIORITY_CONFIG: {
    LOW: { label: 'Low', dot: '', badge: '' },
    MEDIUM: { label: 'Medium', dot: '', badge: '' },
    HIGH: { label: 'High', dot: '', badge: '' },
    URGENT: { label: 'Urgent', dot: '', badge: '' },
  },
}))

vi.mock('@/components/Dashboard/Workspaces/project/Tasks/ListRow', () => ({
  COLUMNS: [
    { status: 'TODO', label: 'To Do', icon: null, color: '' },
    { status: 'IN_PROGRESS', label: 'In Progress', icon: null, color: '' },
    { status: 'IN_REVIEW', label: 'In Review', icon: null, color: '' },
    { status: 'COMPLETED', label: 'Completed', icon: null, color: '' },
  ],
}))

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}))

const defaultProps = {
  viewMode: 'board' as const,
  setViewMode: vi.fn(),
  search: '',
  setSearch: vi.fn(),
  priorityFilter: 'ALL' as const,
  setPriorityFilter: vi.fn(),
  statusFilter: 'ALL' as const,
  setStatusFilter: vi.fn(),
}

describe('Toolbar', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the search input', () => {
    render(<Toolbar {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search tasks…')).toBeInTheDocument()
  })

  it('renders the board view as active', () => {
    render(<Toolbar {...defaultProps} />)
    const boardBtn = screen.getByLabelText('board view')
    expect(boardBtn).toBeInTheDocument()
  })

  it('renders the list view button', () => {
    render(<Toolbar {...defaultProps} />)
    const listBtn = screen.getByLabelText('list view')
    expect(listBtn).toBeInTheDocument()
  })

  it('does not show Clear button when no filters active', () => {
    render(<Toolbar {...defaultProps} />)
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })
})
