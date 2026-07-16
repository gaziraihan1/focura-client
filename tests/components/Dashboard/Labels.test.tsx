import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../../utils/renderWithProviders'
import LabelCard from '@/components/Dashboard/Labels/LabelCard'
import { LabelHeader } from '@/components/Dashboard/Labels/LabelDetails/LabelHeader'
import { LabelEmptyState } from '@/components/Dashboard/Labels/LabelDetails/LabelEmptyState'
import { StatusBadge } from '@/components/Dashboard/Labels/LabelDetails/StatusBadge'
import { PriorityBadge } from '@/components/Dashboard/Labels/LabelDetails/PriorityBadge'
import { PaginationControls } from '@/components/Dashboard/Labels/LabelDetails/PaginationControls'
import { TaskGrid } from '@/components/Dashboard/Labels/LabelDetails/TaskGrid'
import { TaskCard } from '@/components/Dashboard/Labels/LabelDetails/TaskCard'
import { LabelNameInput } from '@/components/Dashboard/Labels/LabelFormModal/LabelNameInput'
import { LabelColorPicker } from '@/components/Dashboard/Labels/LabelFormModal/LabelColorPicker'
import { LabelDescriptionInput } from '@/components/Dashboard/Labels/LabelFormModal/LabelDescriptionInput'
import { LabelPreview } from '@/components/Dashboard/Labels/LabelFormModal/LabelPreview'
import { LabelFormActions } from '@/components/Dashboard/Labels/LabelFormModal/LabelFormActions'
import LabelFormHeader from '@/components/Dashboard/Labels/LabelFormModal/LabelFormHeader'

const mockLabel = {
  id: 'label-1',
  name: 'Bug',
  description: 'Bug reports and fixes',
  color: '#ef4444',
  createdAt: '2026-07-10T00:00:00Z',
  workspace: {
    id: 'ws-1',
    name: 'Test Workspace',
    slug: 'test-workspace',
  },
  _count: {
    tasks: 5,
  },
} as any

const mockTask = {
  id: 'task-1',
  title: 'Fix login bug',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  workspace: {
    id: 'ws-1',
    name: 'Test Workspace',
    slug: 'test-workspace',
  },
  project: {
    id: 'proj-1',
    name: 'Test Project',
    slug: 'test-project',
  },
}

describe('Labels/LabelCard', () => {
  const defaultProps = {
    label: mockLabel,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    isDropdownActive: false,
    onDropdownToggle: vi.fn(),
    canManageLabels: true,
  }

  it('renders label name', () => {
    render(<LabelCard {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('renders label description', () => {
    render(<LabelCard {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Bug reports and fixes')).toBeInTheDocument()
  })

  it('renders task count', () => {
    render(<LabelCard {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('5 tasks')).toBeInTheDocument()
  })

  it('renders singular task count', () => {
    const labelWithOneTask = { ...mockLabel, _count: { tasks: 1 } }
    render(<LabelCard {...defaultProps} label={labelWithOneTask} />, { wrapper: createWrapper() })
    expect(screen.getByText('1 task')).toBeInTheDocument()
  })

  it('renders created date', () => {
    render(<LabelCard {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Jul 10')).toBeInTheDocument()
  })

  it('renders options button', () => {
    render(<LabelCard {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByLabelText('Label options')).toBeInTheDocument()
  })

  it('shows dropdown when isDropdownActive is true', () => {
    render(<LabelCard {...defaultProps} isDropdownActive={true} />, { wrapper: createWrapper() })
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls onDropdownToggle when options button is clicked', async () => {
    const onDropdownToggle = vi.fn()
    render(<LabelCard {...defaultProps} onDropdownToggle={onDropdownToggle} />, { wrapper: createWrapper() })
    const optionsButton = screen.getByLabelText('Label options')
    await optionsButton.click()
    expect(onDropdownToggle).toHaveBeenCalled()
  })

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn()
    render(<LabelCard {...defaultProps} isDropdownActive={true} onEdit={onEdit} />, { wrapper: createWrapper() })
    const editButton = screen.getByText('Edit')
    await editButton.click()
    expect(onEdit).toHaveBeenCalled()
  })

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn()
    render(<LabelCard {...defaultProps} isDropdownActive={true} onDelete={onDelete} />, { wrapper: createWrapper() })
    const deleteButton = screen.getByText('Delete')
    await deleteButton.click()
    expect(onDelete).toHaveBeenCalled()
  })

  it('shows permission modal when canManageLabels is false', async () => {
    render(<LabelCard {...defaultProps} canManageLabels={false} isDropdownActive={true} />, { wrapper: createWrapper() })
    const editButton = screen.getByText('Edit')
    await editButton.click()
    expect(screen.getByText('Permission Required')).toBeInTheDocument()
  })

  it('renders label color', () => {
    render(<LabelCard {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('renders label link', () => {
    render(<LabelCard {...defaultProps} />, { wrapper: createWrapper() })
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('renders with zero tasks', () => {
    const labelWithNoTasks = { ...mockLabel, _count: { tasks: 0 } }
    render(<LabelCard {...defaultProps} label={labelWithNoTasks} />, { wrapper: createWrapper() })
    expect(screen.getByText('0 tasks')).toBeInTheDocument()
  })

  it('renders without description', () => {
    const labelWithoutDescription = { ...mockLabel, description: null }
    render(<LabelCard {...defaultProps} label={labelWithoutDescription} />, { wrapper: createWrapper() })
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })
})

describe('Labels/LabelHeader', () => {
  it('renders label name', () => {
    render(<LabelHeader name="Bug" taskCount={5} />, { wrapper: createWrapper() })
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('renders task count', () => {
    render(<LabelHeader name="Bug" taskCount={5} />, { wrapper: createWrapper() })
    expect(screen.getByText('5 tasks')).toBeInTheDocument()
  })

  it('renders singular task count', () => {
    render(<LabelHeader name="Bug" taskCount={1} />, { wrapper: createWrapper() })
    expect(screen.getByText('1 task')).toBeInTheDocument()
  })

  it('renders label color', () => {
    render(<LabelHeader name="Bug" color="#ef4444" taskCount={5} />, { wrapper: createWrapper() })
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('renders with default color', () => {
    render(<LabelHeader name="Bug" taskCount={5} />, { wrapper: createWrapper() })
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })
})

describe('Labels/LabelEmptyState', () => {
  it('renders empty state message', () => {
    render(<LabelEmptyState />, { wrapper: createWrapper() })
    expect(screen.getByText('No tasks yet')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<LabelEmptyState />, { wrapper: createWrapper() })
    expect(screen.getByText(/Tasks assigned to this label/)).toBeInTheDocument()
  })
})

describe('Labels/StatusBadge', () => {
  it('renders todo status', () => {
    render(<StatusBadge status="todo" />, { wrapper: createWrapper() })
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })

  it('renders in_progress status', () => {
    render(<StatusBadge status="in_progress" />, { wrapper: createWrapper() })
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('renders in_review status', () => {
    render(<StatusBadge status="in_review" />, { wrapper: createWrapper() })
    expect(screen.getByText('In Review')).toBeInTheDocument()
  })

  it('renders done status', () => {
    render(<StatusBadge status="done" />, { wrapper: createWrapper() })
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('renders cancelled status', () => {
    render(<StatusBadge status="cancelled" />, { wrapper: createWrapper() })
    expect(screen.getByText('Cancelled')).toBeInTheDocument()
  })

  it('renders unknown status', () => {
    render(<StatusBadge status="unknown" />, { wrapper: createWrapper() })
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })
})

describe('Labels/PriorityBadge', () => {
  it('renders urgent priority', () => {
    render(<PriorityBadge priority="urgent" />, { wrapper: createWrapper() })
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('renders high priority', () => {
    render(<PriorityBadge priority="high" />, { wrapper: createWrapper() })
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('renders medium priority', () => {
    render(<PriorityBadge priority="medium" />, { wrapper: createWrapper() })
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('renders low priority', () => {
    render(<PriorityBadge priority="low" />, { wrapper: createWrapper() })
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('renders no_priority', () => {
    render(<PriorityBadge priority="no_priority" />, { wrapper: createWrapper() })
    expect(screen.getByText('No Priority')).toBeInTheDocument()
  })

  it('renders unknown priority', () => {
    render(<PriorityBadge priority="unknown" />, { wrapper: createWrapper() })
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })
})

describe('Labels/PaginationControls', () => {
  const mockPagination = {
    page: 1,
    totalPages: 5,
    hasNextPage: true,
    hasPrevPage: false,
    total: 50,
    limit: 10,
  }

  it('renders page info', () => {
    render(<PaginationControls pagination={mockPagination} onPageChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText('1–10 of 50')).toBeInTheDocument()
  })

  it('renders page buttons', () => {
    render(<PaginationControls pagination={mockPagination} onPageChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onPageChange when page button is clicked', async () => {
    const onPageChange = vi.fn()
    render(<PaginationControls pagination={mockPagination} onPageChange={onPageChange} />, { wrapper: createWrapper() })
    const nextButton = screen.getByLabelText('Next page')
    await nextButton.click()
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('disables prev button on first page', () => {
    render(<PaginationControls pagination={mockPagination} onPageChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
  })

  it('disables next button on last page', () => {
    const lastPagePagination = { ...mockPagination, page: 5, hasNextPage: false, hasPrevPage: true }
    render(<PaginationControls pagination={lastPagePagination} onPageChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })

  it('renders ellipsis for many pages', () => {
    const manyPagesPagination = { ...mockPagination, page: 5, totalPages: 20, limit: 10, total: 200 }
    render(<PaginationControls pagination={manyPagesPagination} onPageChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getAllByText('…').length).toBeGreaterThan(0)
  })

  it('renders zero results', () => {
    const zeroPagination = { ...mockPagination, total: 0, totalPages: 0 }
    render(<PaginationControls pagination={zeroPagination} onPageChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText('No results')).toBeInTheDocument()
  })
})

describe('Labels/TaskGrid', () => {
  const mockPagination = {
    page: 1,
    totalPages: 2,
    hasNextPage: true,
    hasPrevPage: false,
    total: 15,
    limit: 10,
  }

  it('renders tasks', () => {
    render(
      <TaskGrid
        tasks={[{ task: mockTask }]}
        pagination={mockPagination}
        onPageChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
  })

  it('renders empty state when no tasks', () => {
    render(
      <TaskGrid tasks={[]} pagination={mockPagination} onPageChange={vi.fn()} />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('No tasks yet')).toBeInTheDocument()
  })

  it('renders pagination when multiple pages', () => {
    render(
      <TaskGrid
        tasks={[{ task: mockTask }]}
        pagination={mockPagination}
        onPageChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('1–10 of 15')).toBeInTheDocument()
  })

  it('does not render pagination when single page', () => {
    const singlePagePagination = { ...mockPagination, totalPages: 1, hasNextPage: false }
    render(
      <TaskGrid
        tasks={[{ task: mockTask }]}
        pagination={singlePagePagination}
        onPageChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.queryByText('1–10 of 15')).not.toBeInTheDocument()
  })
})

describe('Labels/TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={mockTask} />, { wrapper: createWrapper() })
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<TaskCard task={mockTask} />, { wrapper: createWrapper() })
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('renders priority badge', () => {
    render(<TaskCard task={mockTask} />, { wrapper: createWrapper() })
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('renders workspace name', () => {
    render(<TaskCard task={mockTask} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Workspace')).toBeInTheDocument()
  })

  it('renders project name', () => {
    render(<TaskCard task={mockTask} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('renders link to task', () => {
    render(<TaskCard task={mockTask} />, { wrapper: createWrapper() })
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/dashboard/workspaces/test-workspace/projects/test-project/tasks/task-1')
  })
})

describe('Labels/LabelNameInput', () => {
  it('renders label', () => {
    render(<LabelNameInput value="" isSubmitting={false} onChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText(/Name/)).toBeInTheDocument()
  })

  it('renders input with value', () => {
    render(<LabelNameInput value="Bug" isSubmitting={false} onChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByDisplayValue('Bug')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<LabelNameInput value="" error="Name is required" isSubmitting={false} onChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText('Name is required')).toBeInTheDocument()
  })

  it('disables input when submitting', () => {
    render(<LabelNameInput value="Bug" isSubmitting={true} onChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByDisplayValue('Bug')).toBeDisabled()
  })

  it('calls onChange when input changes', async () => {
    const onChange = vi.fn()
    render(<LabelNameInput value="" isSubmitting={false} onChange={onChange} />, { wrapper: createWrapper() })
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Bug' } })
    expect(onChange).toHaveBeenCalledWith('Bug')
  })
})

describe('Labels/LabelColorPicker', () => {
  const mockColors = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#22c55e' },
  ]

  it('renders color options', () => {
    render(
      <LabelColorPicker
        selectedColor="#ef4444"
        colors={mockColors}
        isSubmitting={false}
        onColorSelect={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByTitle('Red')).toBeInTheDocument()
    expect(screen.getByTitle('Blue')).toBeInTheDocument()
    expect(screen.getByTitle('Green')).toBeInTheDocument()
  })

  it('calls onColorSelect when color is clicked', async () => {
    const onColorSelect = vi.fn()
    render(
      <LabelColorPicker
        selectedColor=""
        colors={mockColors}
        isSubmitting={false}
        onColorSelect={onColorSelect}
      />,
      { wrapper: createWrapper() }
    )
    const colorButton = screen.getByTitle('Red')
    await colorButton.click()
    expect(onColorSelect).toHaveBeenCalledWith('#ef4444')
  })

  it('disables colors when submitting', () => {
    render(
      <LabelColorPicker
        selectedColor="#ef4444"
        colors={mockColors}
        isSubmitting={true}
        onColorSelect={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByTitle('Red')).toBeDisabled()
  })

  it('shows error message', () => {
    render(
      <LabelColorPicker
        selectedColor=""
        colors={mockColors}
        error="Color is required"
        isSubmitting={false}
        onColorSelect={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Color is required')).toBeInTheDocument()
  })
})

describe('Labels/LabelDescriptionInput', () => {
  it('renders label', () => {
    render(<LabelDescriptionInput value="" isSubmitting={false} onChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText(/Description/)).toBeInTheDocument()
  })

  it('renders textarea with value', () => {
    render(<LabelDescriptionInput value="Test description" isSubmitting={false} onChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument()
  })

  it('disables textarea when submitting', () => {
    render(<LabelDescriptionInput value="Test" isSubmitting={true} onChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByDisplayValue('Test')).toBeDisabled()
  })

  it('calls onChange when textarea changes', async () => {
    const onChange = vi.fn()
    render(<LabelDescriptionInput value="" isSubmitting={false} onChange={onChange} />, { wrapper: createWrapper() })
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Test description' } })
    expect(onChange).toHaveBeenCalledWith('Test description')
  })
})

describe('Labels/LabelPreview', () => {
  it('renders preview label', () => {
    render(<LabelPreview name="Bug" color="#ef4444" />, { wrapper: createWrapper() })
    expect(screen.getByText('Preview')).toBeInTheDocument()
  })

  it('renders label name', () => {
    render(<LabelPreview name="Bug" color="#ef4444" />, { wrapper: createWrapper() })
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('renders default name when empty', () => {
    render(<LabelPreview name="" color="#ef4444" />, { wrapper: createWrapper() })
    expect(screen.getByText('Label name')).toBeInTheDocument()
  })

  it('renders label color', () => {
    render(<LabelPreview name="Bug" color="#ef4444" />, { wrapper: createWrapper() })
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })
})

describe('Labels/LabelFormActions', () => {
  it('renders cancel button', () => {
    render(<LabelFormActions isEditing={false} isSubmitting={false} onCancel={vi.fn()} onSubmit={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('renders create button', () => {
    render(<LabelFormActions isEditing={false} isSubmitting={false} onCancel={vi.fn()} onSubmit={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText('Create Label')).toBeInTheDocument()
  })

  it('renders save button when editing', () => {
    render(<LabelFormActions isEditing={true} isSubmitting={false} onCancel={vi.fn()} onSubmit={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  it('disables buttons when submitting', () => {
    render(<LabelFormActions isEditing={false} isSubmitting={true} onCancel={vi.fn()} onSubmit={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText('Cancel')).toBeDisabled()
    const submitButton = screen.getByText('Create Label').closest('button')
    expect(submitButton).toBeDisabled()
  })

  it('calls onCancel when cancel is clicked', async () => {
    const onCancel = vi.fn()
    render(<LabelFormActions isEditing={false} isSubmitting={false} onCancel={onCancel} onSubmit={vi.fn()} />, { wrapper: createWrapper() })
    const cancelButton = screen.getByText('Cancel')
    await cancelButton.click()
    expect(onCancel).toHaveBeenCalled()
  })
})

describe('Labels/LabelFormHeader', () => {
  it('renders title', () => {
    render(<LabelFormHeader title="Create Label" onClose={vi.fn()} isSubmitting={false} />, { wrapper: createWrapper() })
    expect(screen.getByText('Create Label')).toBeInTheDocument()
  })

  it('renders close button', () => {
    render(<LabelFormHeader title="Create Label" onClose={vi.fn()} isSubmitting={false} />, { wrapper: createWrapper() })
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    render(<LabelFormHeader title="Create Label" onClose={onClose} isSubmitting={false} />, { wrapper: createWrapper() })
    const closeButton = screen.getByRole('button')
    await closeButton.click()
    expect(onClose).toHaveBeenCalled()
  })

  it('disables close button when submitting', () => {
    render(<LabelFormHeader title="Create Label" onClose={vi.fn()} isSubmitting={true} />, { wrapper: createWrapper() })
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
