import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LabelPicker } from '@/components/Labels/LabelPicker'
import { createWrapper } from '../utils/renderWithProviders'

const mockLabels = [
  { id: '1', name: 'Bug', color: '#EF4444', description: 'Bug label', workspaceId: 'ws-1', createdById: 'user-1', createdAt: new Date(), _count: { tasks: 5 } },
  { id: '2', name: 'Feature', color: '#3B82F6', description: 'Feature label', workspaceId: 'ws-1', createdById: 'user-1', createdAt: new Date(), _count: { tasks: 3 } },
  { id: '3', name: 'Urgent', color: '#F59E0B', description: null, workspaceId: 'ws-1', createdById: 'user-1', createdAt: new Date(), _count: { tasks: 0 } },
]

vi.mock('@/hooks/useLabels', () => ({
  useLabels: vi.fn(() => ({
    data: { data: mockLabels },
    isLoading: false,
  })),
}))

describe('LabelPicker', () => {
  const onChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Labels label', () => {
    render(<LabelPicker selectedLabelIds={[]} onChange={onChange} />, { wrapper: createWrapper() })
    expect(screen.getByText('Labels')).toBeInTheDocument()
  })

  it('renders add label button', () => {
    render(<LabelPicker selectedLabelIds={[]} onChange={onChange} />, { wrapper: createWrapper() })
    expect(screen.getByText('Add label')).toBeInTheDocument()
  })

  it('shows helper text when no labels selected', () => {
    render(<LabelPicker selectedLabelIds={[]} onChange={onChange} />, { wrapper: createWrapper() })
    expect(screen.getByText(/Add labels to categorize/)).toBeInTheDocument()
  })

  it('does not show helper text when labels are selected', () => {
    render(<LabelPicker selectedLabelIds={['1']} onChange={onChange} />, { wrapper: createWrapper() })
    expect(screen.queryByText(/Add labels to categorize/)).not.toBeInTheDocument()
  })

  it('shows dropdown when add button is clicked', () => {
    render(<LabelPicker selectedLabelIds={[]} onChange={onChange} />, { wrapper: createWrapper() })
    fireEvent.click(screen.getByText('Add label'))
    // Dropdown should show all labels
    const dropdown = screen.getAllByText('Bug')
    expect(dropdown.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Feature')).toBeInTheDocument()
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('calls onChange with new label when label is selected from dropdown', () => {
    render(<LabelPicker selectedLabelIds={[]} onChange={onChange} />, { wrapper: createWrapper() })
    fireEvent.click(screen.getByText('Add label'))
    fireEvent.click(screen.getByText('Bug'))
    expect(onChange).toHaveBeenCalledWith(['1'])
  })

  it('shows selected count when labels are selected', () => {
    render(<LabelPicker selectedLabelIds={['1', '2']} onChange={onChange} />, { wrapper: createWrapper() })
    expect(screen.getByText('(2/10)')).toBeInTheDocument()
  })

  it('removes selected label when X button is clicked', () => {
    render(<LabelPicker selectedLabelIds={['1', '2']} onChange={onChange} />, { wrapper: createWrapper() })
    const { container } = render(<LabelPicker selectedLabelIds={['1', '2']} onChange={onChange} />, { wrapper: createWrapper() })
    // Find the X button inside the first LabelBadge
    const removeButtons = container.querySelectorAll('.lucide-x')
    fireEvent.click(removeButtons[0])
    expect(onChange).toHaveBeenCalled()
  })
})
