import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Toolbar } from '@/components/dashboard/workspace/project-overview/Tasks/ToolBar'

vi.mock('lucide-react', () => ({
  CalendarDays: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="calendar-days" {...props} />,
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="chevron" {...props} />,
  Eye: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="eye" {...props} />,
  Flag: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="flag" {...props} />,
  GanttChartSquare: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="gantt-chart" {...props} />,
  Sprout: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="sprout" {...props} />,  Filter: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="filter" {...props} />,
  FolderOpen: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="folder-open" {...props} />,
  LayoutGrid: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="layout-grid" {...props} />,
  List: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="list" {...props} />,
  Search: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="search" {...props} />,
  SlidersHorizontal: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="sliders" {...props} />,
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x" {...props} />,
}))

vi.mock('@/components/dashboard/workspace/project-overview/Tasks/PriorityBadge', () => ({
  PRIORITY_CONFIG: {
    LOW: { label: 'Low', dot: '', badge: '' },
    MEDIUM: { label: 'Medium', dot: '', badge: '' },
    HIGH: { label: 'High', dot: '', badge: '' },
    URGENT: { label: 'Urgent', dot: '', badge: '' },
  },
}))

vi.mock('@/components/dashboard/workspace/project-overview/Tasks/ListRow', () => ({
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

  it('toggles the mobile Filters panel open and closed', () => {
    render(<Toolbar {...defaultProps} />)
    const filtersBtn = screen.getByRole('button', { name: /filters/i })
    expect(filtersBtn).toBeInTheDocument()
    // Filters area starts closed on mobile
    const panel = document.getElementById('project-task-filters')
    expect(panel).not.toBeNull()
    expect(panel!.className).toContain('hidden')
    fireEvent.click(filtersBtn)
    expect(panel!.className).not.toContain('hidden')
    fireEvent.click(filtersBtn)
    expect(panel!.className).toContain('hidden')
  })

  it('renders the board view as active', () => {
    render(<Toolbar {...defaultProps} />)
    const boardBtns = screen.getAllByLabelText('board view')
    expect(boardBtns.length).toBeGreaterThan(0)
    expect(boardBtns[0]).toBeInTheDocument()
  })

  it('renders the list view button', () => {
    render(<Toolbar {...defaultProps} />)
    const listBtns = screen.getAllByLabelText('list view')
    expect(listBtns.length).toBeGreaterThan(0)
  })

  it('renders the calendar and timeline view buttons', () => {
    render(<Toolbar {...defaultProps} />)
    expect(screen.getAllByLabelText('calendar view').length).toBeGreaterThan(0)
    expect(screen.getAllByLabelText('timeline view').length).toBeGreaterThan(0)
  })

  it('switches to calendar and timeline views', () => {
    const setViewMode = vi.fn()
    render(<Toolbar {...defaultProps} setViewMode={setViewMode} />)
    fireEvent.click(screen.getAllByLabelText('calendar view')[0])
    expect(setViewMode).toHaveBeenCalledWith('calendar')
    fireEvent.click(screen.getAllByLabelText('timeline view')[0])
    expect(setViewMode).toHaveBeenCalledWith('timeline')
  })

  it('does not show Clear button when no filters active', () => {
    render(<Toolbar {...defaultProps} />)
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })

  it('renders the section dropdown and filters by a chosen section', () => {
    const setSectionFilter = vi.fn()
    render(
      <Toolbar
        {...defaultProps}
        sections={[{ id: 's1', name: 'Frontend', color: '#667eea', status: 'ACTIVE', position: 0, projectId: 'p1' }]}
        sectionFilter="ALL"
        setSectionFilter={setSectionFilter}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Section' }))
    fireEvent.click(screen.getByRole('button', { name: 'Frontend' }))
    expect(setSectionFilter).toHaveBeenCalledWith('s1')
  })

  it('shows the active section name on the dropdown button', () => {
    render(
      <Toolbar
        {...defaultProps}
        sections={[{ id: 's1', name: 'Frontend', color: '#667eea', status: 'ACTIVE', position: 0, projectId: 'p1' }]}
        sectionFilter="s1"
        setSectionFilter={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /Frontend/i })).toBeInTheDocument()
  })

  it('shows the Clear button when a filter is active and calls onClearFilters', () => {
    const onClearFilters = vi.fn()
    render(<Toolbar {...defaultProps} priorityFilter="HIGH" onClearFilters={onClearFilters} />)
    const clearBtn = screen.getByRole('button', { name: /clear/i })
    expect(clearBtn).toBeInTheDocument()
    fireEvent.click(clearBtn)
    expect(onClearFilters).toHaveBeenCalledTimes(1)
  })

  it('shows the Clear button when there is a search query', () => {
    render(<Toolbar {...defaultProps} search="bug" onClearFilters={vi.fn()} />)
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })

  it('shows Reset view when a view is active and calls onResetView', () => {
    const onResetView = vi.fn()
    const view = { id: 'v1', name: 'My List', type: 'LIST' as const, isDefault: false, visibility: 'PRIVATE' as const, createdById: 'u1', projectId: 'p1' }
    render(<Toolbar {...defaultProps} views={[view]} activeViewId="v1" onResetView={onResetView} />)
    const resetBtn = screen.getByRole('button', { name: /reset view/i })
    expect(resetBtn).toBeInTheDocument()
    fireEvent.click(resetBtn)
    expect(onResetView).toHaveBeenCalledTimes(1)
  })

  it('does not show Reset view when no view is active', () => {
    render(<Toolbar {...defaultProps} views={[]} onResetView={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /reset view/i })).not.toBeInTheDocument()
  })
})
