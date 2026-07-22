import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LabelForm from '@/components/Labels/LabelForm'

vi.mock('@/hooks/useLabels', () => ({
  useLabelNameExists: () => vi.fn(() => false),
}))

describe('LabelForm', () => {
  const defaultProps = {
    onSave: vi.fn(),
    onCancel: vi.fn(),
    isSaving: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the form with name input', () => {
    render(<LabelForm {...defaultProps} />)

    expect(screen.getByPlaceholderText(/Bug, Feature, Documentation/)).toBeInTheDocument()
  })

  it('renders color picker', () => {
    render(<LabelForm {...defaultProps} />)

    expect(screen.getByText('Color')).toBeInTheDocument()
    const colorInput = screen.getAllByRole('button')
    expect(colorInput.length).toBeGreaterThanOrEqual(16)
  })

  it('renders description textarea', () => {
    render(<LabelForm {...defaultProps} />)

    expect(screen.getByText('Description (Optional)')).toBeInTheDocument()
  })

  it('renders Create button when no label', () => {
    render(<LabelForm {...defaultProps} />)

    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('renders Update button when editing existing label', () => {
    render(
      <LabelForm
        {...defaultProps}
        label={{ id: '1', name: 'Bug', color: '#ef4444', description: 'A bug' } as any}
      />
    )

    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument()
  })

  it('pre-fills name when editing', () => {
    render(
      <LabelForm
        {...defaultProps}
        label={{ id: '1', name: 'Bug', color: '#ef4444', description: 'A bug' } as any}
      />
    )

    expect(screen.getByDisplayValue('Bug')).toBeInTheDocument()
  })

  it('pre-fills description when editing', () => {
    render(
      <LabelForm
        {...defaultProps}
        label={{ id: '1', name: 'Bug', color: '#ef4444', description: 'A bug' } as any}
      />
    )

    expect(screen.getByDisplayValue('A bug')).toBeInTheDocument()
  })

  it('calls onCancel when cancel button clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(<LabelForm {...defaultProps} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onCancel).toHaveBeenCalled()
  })

  it('calls onSave with form data on submit', async () => {
    const onSave = vi.fn()
    const user = userEvent.setup()

    render(<LabelForm {...defaultProps} onSave={onSave} />)

    const nameInput = screen.getByPlaceholderText(/Bug, Feature, Documentation/)
    await user.clear(nameInput)
    await user.type(nameInput, 'Feature')

    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Feature',
        color: expect.any(String),
      })
    )
  })

  it('trims whitespace from name', async () => {
    const onSave = vi.fn()
    const user = userEvent.setup()

    render(<LabelForm {...defaultProps} onSave={onSave} />)

    const nameInput = screen.getByPlaceholderText(/Bug, Feature, Documentation/)
    await user.clear(nameInput)
    await user.type(nameInput, '  Feature  ')

    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Feature',
      })
    )
  })

  it('shows Saving... when isSaving is true', () => {
    render(<LabelForm {...defaultProps} isSaving={true} />)

    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })

  it('disables buttons when isSaving', () => {
    render(<LabelForm {...defaultProps} isSaving={true} />)

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
  })

  it('renders color swatches', () => {
    const { container } = render(<LabelForm {...defaultProps} />)

    const swatches = container.querySelectorAll('.rounded-full')
    expect(swatches.length).toBeGreaterThanOrEqual(16)
  })

  it('has maxLength on name input', () => {
    render(<LabelForm {...defaultProps} />)

    const nameInput = screen.getByPlaceholderText(/Bug, Feature, Documentation/)
    expect(nameInput).toHaveAttribute('maxLength', '50')
  })

  it('has maxLength on description textarea', () => {
    render(<LabelForm {...defaultProps} />)

    const textarea = screen.getByPlaceholderText('What is this label for?')
    expect(textarea).toHaveAttribute('maxLength', '200')
  })
})
