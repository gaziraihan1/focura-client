import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PricingPlans from '@/components/Pricing/PricingPlans'

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props}>{props.children}</div>,
    span: (props: any) => <span {...props}>{props.children}</span>,
  },
}))

describe('PricingPlans', () => {
  it('renders the heading', () => {
    render(<PricingPlans />)
    expect(screen.getByText(/Pricing that grows with your team/)).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<PricingPlans />)
    expect(screen.getByText(/Transparent, scalable/)).toBeInTheDocument()
  })

  it('renders all 3 plan names', () => {
    render(<PricingPlans />)
    expect(screen.getAllByText('Free').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Pro').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Business').length).toBeGreaterThanOrEqual(1)
  })

  it('renders plan prices', () => {
    render(<PricingPlans />)
    expect(screen.getAllByText('Free').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$12/mo')).toBeInTheDocument()
    expect(screen.getByText('$49/mo')).toBeInTheDocument()
  })

  it('renders "Most Popular" badge for Pro plan', () => {
    render(<PricingPlans />)
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })

  it('renders "Get Started" buttons for each plan', () => {
    render(<PricingPlans />)
    const buttons = screen.getAllByText('Get Started')
    expect(buttons).toHaveLength(3)
  })

  it('renders plan features', () => {
    render(<PricingPlans />)
    expect(screen.getByText('100 task everyday')).toBeInTheDocument()
    expect(screen.getAllByText('Unlimited projects').length).toBeGreaterThanOrEqual(1)
  })

  it('renders "/workspace" suffix for paid plans', () => {
    render(<PricingPlans />)
    const workspaceTexts = screen.getAllByText('/workspace')
    expect(workspaceTexts.length).toBeGreaterThanOrEqual(2)
  })
})
