import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingState } from '@/components/Shared/LoadingState'

vi.mock('lucide-react', () => ({
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="loader" {...props} />,
}))

describe('LoadingState', () => {
  it('renders loader icon', () => {
    render(<LoadingState />)
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('applies animate-spin class', () => {
    const { container } = render(<LoadingState />)
    const loader = container.querySelector('.animate-spin')
    expect(loader).toBeInTheDocument()
  })

  it('renders centered container', () => {
    const { container } = render(<LoadingState />)
    const flexContainer = container.querySelector('.flex')
    expect(flexContainer).toBeInTheDocument()
    expect(flexContainer).toHaveClass('items-center', 'justify-center', 'min-h-screen')
  })
})
