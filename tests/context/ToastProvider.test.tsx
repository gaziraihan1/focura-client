import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ToastProvider from '@/context/providers/ToastProvider'

vi.mock('react-hot-toast', () => ({
  Toaster: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="toaster" data-position={props.position} />,
}))

describe('ToastProvider', () => {
  it('renders the Toaster component', () => {
    render(<ToastProvider />)

    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })

  it('sets position to top-right', () => {
    render(<ToastProvider />)

    expect(screen.getByTestId('toaster')).toHaveAttribute('data-position', 'top-right')
  })

  it('wraps in a fixed container with pointer-events-none', () => {
    const { container } = render(<ToastProvider />)

    // Find the fixed container (may not be firstChild due to sr-only announcer divs)
    const fixedContainer = container.querySelector('.fixed.inset-0.pointer-events-none')
    expect(fixedContainer).toBeInTheDocument()
  })
})
