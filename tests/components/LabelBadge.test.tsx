import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LabelBadge } from '@/components/Labels/LabelBadge'

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Tag: (props: any) => <svg data-testid="tag-icon" {...props} />,
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
}))

const mockLabel = {
  id: 'label-1',
  name: 'Bug',
  color: '#EF4444',
  description: null,
  workspaceId: 'ws-1',
  createdById: 'user-1',
  createdAt: new Date(),
  _count: { tasks: 5 },
}

describe('LabelBadge', () => {
  it('renders label name', () => {
    render(<LabelBadge label={mockLabel} />)

    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('renders tag icon', () => {
    render(<LabelBadge label={mockLabel} />)

    expect(screen.getByTestId('tag-icon')).toBeInTheDocument()
  })

  it('applies label color as background', () => {
    const { container } = render(<LabelBadge label={mockLabel} />)

    const badge = container.firstChild as HTMLElement
    expect(badge.style.backgroundColor).toContain('239')
  })

  it('applies label color as text color', () => {
    const { container } = render(<LabelBadge label={mockLabel} />)

    const badge = container.firstChild as HTMLElement
    expect(badge.style.color).toContain('239')
  })

  it('shows remove button when onRemove is provided', () => {
    const onRemove = vi.fn()
    render(<LabelBadge label={mockLabel} onRemove={onRemove} />)

    expect(screen.getByTestId('x-icon')).toBeInTheDocument()
  })

  it('does not show remove button when onRemove is not provided', () => {
    render(<LabelBadge label={mockLabel} />)

    expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument()
  })

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn()
    render(<LabelBadge label={mockLabel} onRemove={onRemove} />)

    fireEvent.click(screen.getByTestId('x-icon'))
    expect(onRemove).toHaveBeenCalled()
  })

  it('applies sm size class', () => {
    const { container } = render(<LabelBadge label={mockLabel} size="sm" />)

    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('text-xs')
  })

  it('applies md size class by default', () => {
    const { container } = render(<LabelBadge label={mockLabel} />)

    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('text-sm')
  })

  it('applies custom className', () => {
    const { container } = render(
      <LabelBadge label={mockLabel} className="custom-class" />
    )

    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('custom-class')
  })
})
