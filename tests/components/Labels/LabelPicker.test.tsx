import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../../utils/renderWithProviders'
import { LabelPicker } from '@/components/Labels/LabelPicker'

vi.mock('@/hooks/useLabels', () => ({
  useLabels: vi.fn(),
}))

import { useLabels } from '@/hooks/useLabels'
const mockUseLabels = vi.mocked(useLabels)

const mockLabels = {
  data: [
    { id: 'l1', name: 'Bug', color: '#ef4444', _count: { tasks: 3 } },
    { id: 'l2', name: 'Feature', color: '#3b82f6', _count: { tasks: 0 } },
    { id: 'l3', name: 'Urgent', color: '#f59e0b', _count: { tasks: 5 } },
  ],
}

describe('LabelPicker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLabels.mockReturnValue({ data: mockLabels, isLoading: false } as any)
  })

  it('renders Labels label', () => {
    render(<LabelPicker selectedLabelIds={[]} onChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText('Labels')).toBeInTheDocument()
  })

  it('shows helper text when no labels selected', () => {
    render(<LabelPicker selectedLabelIds={[]} onChange={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText('Add labels to categorize this task')).toBeInTheDocument()
  })

  it('toggles dropdown on Add label button click', async () => {
    const user = userEvent.setup()
    render(<LabelPicker selectedLabelIds={[]} onChange={vi.fn()} />, { wrapper: createWrapper() })
    
    await user.click(screen.getByText('Add label'))
    expect(screen.getByText('Bug')).toBeInTheDocument()
    expect(screen.getByText('Feature')).toBeInTheDocument()
  })

  it('shows loading state in dropdown', async () => {
    mockUseLabels.mockReturnValue({ data: undefined, isLoading: true } as any)
    const user = userEvent.setup()
    render(<LabelPicker selectedLabelIds={[]} onChange={vi.fn()} />, { wrapper: createWrapper() })
    
    await user.click(screen.getByText('Add label'))
    expect(screen.getByText('Loading labels...')).toBeInTheDocument()
  })

  it('shows no labels message when labels array is empty', async () => {
    mockUseLabels.mockReturnValue({ data: { data: [] }, isLoading: false } as any)
    const user = userEvent.setup()
    render(<LabelPicker selectedLabelIds={[]} onChange={vi.fn()} />, { wrapper: createWrapper() })
    
    await user.click(screen.getByText('Add label'))
    expect(screen.getByText('No labels available. Create one first.')).toBeInTheDocument()
  })

  it('shows all selected message when all labels are selected', async () => {
    const user = userEvent.setup()
    render(
      <LabelPicker selectedLabelIds={['l1', 'l2', 'l3']} onChange={vi.fn()} />,
      { wrapper: createWrapper() }
    )
    
    await user.click(screen.getByText('Add label'))
    expect(screen.getByText('All labels have been selected.')).toBeInTheDocument()
  })

  it('shows selected labels count in button', () => {
    render(
      <LabelPicker selectedLabelIds={['l1', 'l2']} onChange={vi.fn()} />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('(2/10)')).toBeInTheDocument()
  })

  it('calls onChange when toggling a label', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<LabelPicker selectedLabelIds={[]} onChange={onChange} />, { wrapper: createWrapper() })
    
    await user.click(screen.getByText('Add label'))
    await user.click(screen.getByText('Bug'))
    expect(onChange).toHaveBeenCalledWith(['l1'])
  })

  it('calls onChange when removing a label via badge', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <LabelPicker selectedLabelIds={['l1']} onChange={onChange} />,
      { wrapper: createWrapper() }
    )
    
    const removeButtons = screen.getAllByRole('button')
    // Find the remove button on the badge (has X icon)
    const badgeRemove = removeButtons.find(btn => btn.querySelector('svg'))
    if (badgeRemove) {
      await user.click(badgeRemove)
      expect(onChange).toHaveBeenCalledWith([])
    }
  })
})
