import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BackLink } from '@/components/Shared/BackLink'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('lucide-react', () => ({
  ArrowLeft: (props: any) => <svg data-testid="arrow-left" {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    span: (props: any) => <span {...props}>{props.children}</span>,
  },
}))

describe('BackLink', () => {
  it('renders link with correct href', () => {
    render(<BackLink href="/dashboard" label="Back to Dashboard" />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/dashboard')
  })

  it('renders label text', () => {
    render(<BackLink href="/dashboard" label="Back to Dashboard" />)

    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument()
  })

  it('renders arrow icon', () => {
    render(<BackLink href="/dashboard" label="Back" />)

    expect(screen.getByTestId('arrow-left')).toBeInTheDocument()
  })
})
