import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PricingSupportCTA from '@/components/Pricing/PricingSupportCTA'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('PricingSupportCTA', () => {
  it('renders the heading', () => {
    render(<PricingSupportCTA />)
    expect(screen.getByText('Still have questions?')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<PricingSupportCTA />)
    expect(screen.getByText(/Our support team is here 24\/7/)).toBeInTheDocument()
  })

  it('renders "Contact Support" link', () => {
    render(<PricingSupportCTA />)
    const link = screen.getByText('Contact Support')
    expect(link).toHaveAttribute('href', '/contact')
  })

  it('renders response time note', () => {
    render(<PricingSupportCTA />)
    expect(screen.getByText(/Average response time/)).toBeInTheDocument()
  })
})
