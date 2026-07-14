import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PricingCards from '@/components/Pricing/PricingCards'

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props}>{props.children}</div>,
    span: (props: any) => <span {...props}>{props.children}</span>,
  },
}))

describe('PricingCards', () => {
  it('renders 3 pricing cards', () => {
    render(<PricingCards billing="monthly" />)
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('Business')).toBeInTheDocument()
  })

  it('renders correct prices for monthly billing', () => {
    render(<PricingCards billing="monthly" />)
    expect(screen.getByText('$0')).toBeInTheDocument()
    expect(screen.getByText('$12')).toBeInTheDocument()
    expect(screen.getByText('$49')).toBeInTheDocument()
  })

  it('renders correct prices for yearly billing', () => {
    render(<PricingCards billing="yearly" />)
    expect(screen.getByText('$0')).toBeInTheDocument()
    expect(screen.getByText('$120')).toBeInTheDocument()
    expect(screen.getByText('$490')).toBeInTheDocument()
  })

  it('renders "Most Popular" for Pro card', () => {
    render(<PricingCards billing="monthly" />)
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })

  it('renders button texts', () => {
    render(<PricingCards billing="monthly" />)
    expect(screen.getByText('Get Started')).toBeInTheDocument()
    expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument()
    expect(screen.getByText('Get Business')).toBeInTheDocument()
  })

  it('renders features for each card', () => {
    render(<PricingCards billing="monthly" />)
    expect(screen.getAllByText('Unlimited Projects').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Team Collaboration').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Priority Support').length).toBeGreaterThanOrEqual(1)
  })
})
