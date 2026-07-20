import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PricingCard from '@/components/Pricing/PricingCard'

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{props.children}</div>,
    span: (props: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{props.children}</span>,
  },
}))

describe('PricingCard', () => {
  const defaultProps = {
    title: 'Pro',
    price: 12,
    features: ['Unlimited Projects', 'Team Collaboration'],
    buttonText: 'Upgrade to Pro',
    popular: false,
    billing: 'monthly' as const,
  }

  it('renders the plan title', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })

  it('renders the price', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByText('$12')).toBeInTheDocument()
  })

  it('renders all features', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByText('Unlimited Projects')).toBeInTheDocument()
    expect(screen.getByText('Team Collaboration')).toBeInTheDocument()
  })

  it('renders the button text', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByRole('button', { name: /upgrade to pro/i })).toBeInTheDocument()
  })

  it('shows "Most Popular" badge when popular', () => {
    render(<PricingCard {...defaultProps} popular={true} />)
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })

  it('does not show "Most Popular" badge when not popular', () => {
    render(<PricingCard {...defaultProps} popular={false} />)
    expect(screen.queryByText('Most Popular')).not.toBeInTheDocument()
  })

  it('shows "Billed monthly" for monthly billing', () => {
    render(<PricingCard {...defaultProps} billing="monthly" />)
    expect(screen.getByText('Billed monthly')).toBeInTheDocument()
  })

  it('shows "Billed yearly" for yearly billing', () => {
    render(<PricingCard {...defaultProps} billing="yearly" />)
    expect(screen.getByText(/Billed yearly/)).toBeInTheDocument()
  })

  it('shows original price with strikethrough for yearly', () => {
    render(
      <PricingCard
        {...defaultProps}
        billing="yearly"
        originalPrice={144}
      />
    )
    expect(screen.getByText('$144')).toBeInTheDocument()
  })

  it('does not show original price for monthly', () => {
    render(
      <PricingCard
        {...defaultProps}
        billing="monthly"
        originalPrice={144}
      />
    )
    expect(screen.queryByText('$144')).not.toBeInTheDocument()
  })
})
