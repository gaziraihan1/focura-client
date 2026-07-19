import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { LabelBadge } from '@/components/Labels/LabelBadge'
import { createWrapper } from '../../utils/renderWithProviders'
import { render } from '@testing-library/react'
import type { Label } from '@/hooks/useLabels'

const baseLabel: Label = {
  id: 'lbl-1',
  name: 'Bug',
  color: '#ef4444',
}

function renderBadge(props: Partial<React.ComponentProps<typeof LabelBadge>> = {}) {
  return render(<LabelBadge label={baseLabel} {...props} />, {
    wrapper: createWrapper(),
  })
}

describe('LabelBadge', () => {
  it('renders the label name', () => {
    renderBadge()
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('renders with md size by default', () => {
    const { container } = renderBadge()
    const badge = container.firstElementChild as HTMLElement
    expect(badge.className).toContain('text-sm')
  })

  it('renders with sm size', () => {
    const { container } = renderBadge({ size: 'sm' })
    const badge = container.firstElementChild as HTMLElement
    expect(badge.className).toContain('text-xs')
  })

  it('calls onRemove when the X button is clicked', () => {
    const onRemove = vi.fn()
    renderBadge({ onRemove })
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('does not render the X button when onRemove is not provided', () => {
    renderBadge()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('applies inline styles with the label color', () => {
    const { container } = renderBadge()
    const badge = container.firstElementChild as HTMLElement
    // JSDOM normalizes hex+alpha to rgba, so use toContain for partial matching
    expect(badge.style.backgroundColor).toContain('239, 68, 68')
    expect(badge.style.color).toContain('239, 68, 68')
    expect(badge.style.border).toContain('239, 68, 68')
    expect(badge.style.border).toContain('1px solid')
  })
})
