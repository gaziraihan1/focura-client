import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorState from '@/components/VerifyEmail/ErrorState'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('VerifyEmail ErrorState', () => {
  it('renders "Verification Failed" heading', () => {
    render(<ErrorState message="Invalid token." />)
    expect(screen.getByText('Verification Failed')).toBeInTheDocument()
  })

  it('renders the provided message', () => {
    render(<ErrorState message="Invalid token." />)
    expect(screen.getByText('Invalid token.')).toBeInTheDocument()
  })

  it('renders "Go to Login" link', () => {
    render(<ErrorState message="Error" />)
    const link = screen.getByText('Go to Login')
    expect(link).toHaveAttribute('href', '/authentication/login')
  })

  it('renders X circle icon', () => {
    const { container } = render(<ErrorState message="Error" />)
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('text-red-500')
  })
})
