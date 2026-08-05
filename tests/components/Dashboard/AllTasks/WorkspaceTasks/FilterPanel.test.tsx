import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterPanel } from '@/components/Dashboard/AllTasks/WorkspaceTasks/FilterPanel'

vi.mock('lucide-react', () => ({
  Tag: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="Tag" {...props} />,
  Brain: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="Brain" {...props} />,
}))

const defaultProps = {
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
  projects: [{ id: 'p1', name: 'Project A' }],
  labels: [{ id: 'l1', name: 'Bug', color: '#ff0000' }],
  members: [{ id: 'm1', name: 'Alice' }],
  focusRequired: false,
  onFocusRequiredChange: vi.fn(),
}

describe('FilterPanel', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders all filter labels', () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Priority')).toBeInTheDocument()
    expect(screen.getByText('Project')).toBeInTheDocument()
    expect(screen.getByText('Assignee')).toBeInTheDocument()
    expect(screen.getByText('Labels')).toBeInTheDocument()
  })

  it('renders project options', () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.getByText('Project A')).toBeInTheDocument()
  })

  it('calls onStatusChange when status changes', () => {
    render(<FilterPanel {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'TODO' } })
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith('TODO')
  })

  it('calls onToggleLabel when label clicked', () => {
    render(<FilterPanel {...defaultProps} />)
    fireEvent.click(screen.getByText('Bug'))
    expect(defaultProps.onToggleLabel).toHaveBeenCalledWith('l1')
  })

  it('renders section filter with sections grouped by project', () => {
    render(
      <FilterPanel
        {...defaultProps}
        sections={[
          { id: 'sec1', name: 'Backlog', projectName: 'Project A' },
          { id: 'sec2', name: 'Research', projectName: 'Project B' },
        ]}
      />,
    )
    expect(screen.getByLabelText('Section')).toBeInTheDocument()
    expect(screen.getByText('Backlog')).toBeInTheDocument()
    expect(screen.getByText('Research')).toBeInTheDocument()
  })

  it('calls onSectionChange when a section is picked', () => {
    const onSectionChange = vi.fn()
    render(
      <FilterPanel
        {...defaultProps}
        sections={[{ id: 'sec1', name: 'Backlog', projectName: 'Project A' }]}
        selectedSection="all"
        onSectionChange={onSectionChange}
      />,
    )
    fireEvent.change(screen.getByLabelText('Section'), { target: { value: 'sec1' } })
    expect(onSectionChange).toHaveBeenCalledWith('sec1')
  })
})
