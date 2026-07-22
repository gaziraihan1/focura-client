import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react';
import { CardLoadingState } from '@/components/Shared/CardLoadingState'

describe('CardLoadingState', () => {
  it('renders a spinning loader', () => {
    const { container } = render(<CardLoadingState />)

    const spinner = container.querySelector('svg')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin')
  })

  it('centers the spinner with flex', () => {
    const { container } = render(<CardLoadingState />)

    expect(container.firstChild).toHaveClass('flex', 'items-center', 'justify-center')
  })

  it('applies primary text color to spinner', () => {
    const { container } = render(<CardLoadingState />)

    const spinner = container.querySelector('svg')
    expect(spinner).toHaveClass('text-primary')
  })
})
