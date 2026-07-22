import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { EmptyState } from '@/components/Shared/EmptyState'

vi.mock('lucide-react', () => {
  const mock = (name: string) => {
    const C = (props: Record<string, unknown>) =>
      React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    C.displayName = name
    return C
  }
  return { Inbox: mock('inbox'), AlertCircle: mock('alert-circle') }
})

describe('EmptyState', () => {
  const defaultProps = {
    icon: (props: Record<string, unknown>) =>
      React.createElement('svg', { 'data-testid': 'test-icon', ...props }),
    title: 'No items found',
    description: 'Create your first item to get started',
  }

  it('renders title', () => {
    render(<EmptyState {...defaultProps} />)
    expect(screen.getByText('No items found')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<EmptyState {...defaultProps} />)
    expect(screen.getByText('Create your first item to get started')).toBeInTheDocument()
  })

  it('renders icon', () => {
    render(<EmptyState {...defaultProps} />)
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('renders action button when provided', () => {
    const onClick = vi.fn()
    render(
      <EmptyState
        {...defaultProps}
        action={{ label: 'Create Item', onClick }}
      />
    )
    const button = screen.getByText('Create Item')
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not render action button when not provided', () => {
    render(<EmptyState {...defaultProps} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <EmptyState {...defaultProps} className="my-custom-class" />
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('my-custom-class')
  })
})
