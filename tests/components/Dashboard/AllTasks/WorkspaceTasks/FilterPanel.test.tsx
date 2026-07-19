import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterPanel } from '@/components/Dashboard/AllTasks/WorkspaceTasks/FilterPanel'

vi.mock('lucide-react', () => ({
  Tag: (props: any) => <svg data-testid="Tag" {...props} />,
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
})
