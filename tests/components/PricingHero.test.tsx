import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PricingHero from '@/components/Pricing/PricingHero'

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props}>{props.children}</div>,
  },
}))

describe('PricingHero', () => {
  it('renders the main heading', () => {
    render(<PricingHero />)
    expect(screen.getByText('Simple, transparent pricing')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<PricingHero />)
    expect(screen.getByText(/Choose a plan that scales with your team/)).toBeInTheDocument()
  })

  it('renders "No credit card required"', () => {
    render(<PricingHero />)
    expect(screen.getByText('No credit card required')).toBeInTheDocument()
  })

  it('renders "Cancel anytime"', () => {
    render(<PricingHero />)
    expect(screen.getByText('Cancel anytime')).toBeInTheDocument()
  })

  it('renders "7-day free trial"', () => {
    render(<PricingHero />)
    expect(screen.getByText('7-day free trial')).toBeInTheDocument()
  })
})
