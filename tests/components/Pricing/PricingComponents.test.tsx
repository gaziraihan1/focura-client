import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock IntersectionObserver for framer-motion whileInView
beforeAll(() => {
  globalThis.IntersectionObserver = class {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any
})

// Mock framer-motion to avoid viewport animation issues
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...filterDomProps(props)}>{children}</div>,
    span: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <span {...filterDomProps(props)}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
}))

function filterDomProps(props: Record<string, unknown>) {
  const domProps: Record<string, unknown> = {}
  for (const key of Object.keys(props)) {
    if (!key.startsWith('initial') && !key.startsWith('animate') && !key.startsWith('while') && !key.startsWith('exit') && !key.startsWith('transition') && !key.startsWith('viewport') && !key.startsWith('layout')) {
      domProps[key] = props[key]
    }
  }
  return domProps
}

import PricingCard from '@/components/Pricing/PricingCard'
import BillingToggle from '@/components/Pricing/BillingToggle'

describe('PricingCard', () => {
  const defaultProps = {
    title: 'Pro',
    price: 29,
    features: ['Unlimited projects', 'Advanced analytics', 'Priority support'],
    buttonText: 'Get Started',
    popular: false,
    billing: 'monthly' as const,
  }

  it('renders title', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })

  it('renders price', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByText('$29')).toBeInTheDocument()
  })

  it('renders features', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByText('Unlimited projects')).toBeInTheDocument()
    expect(screen.getByText('Advanced analytics')).toBeInTheDocument()
    expect(screen.getByText('Priority support')).toBeInTheDocument()
  })

  it('renders button text', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('renders monthly billing text', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByText('Billed monthly')).toBeInTheDocument()
  })

  it('renders yearly billing text', () => {
    render(<PricingCard {...defaultProps} billing="yearly" originalPrice={39} />)
    expect(screen.getByText('Billed yearly (save 20%)')).toBeInTheDocument()
  })

  it('shows original price when yearly billing', () => {
    render(<PricingCard {...defaultProps} billing="yearly" originalPrice={39} />)
    expect(screen.getByText('$39')).toBeInTheDocument()
  })

  it('does not show original price when monthly billing', () => {
    render(<PricingCard {...defaultProps} billing="monthly" originalPrice={39} />)
    expect(screen.queryByText('$39')).not.toBeInTheDocument()
  })

  it('shows most popular badge when popular is true', () => {
    render(<PricingCard {...defaultProps} popular={true} />)
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })

  it('does not show most popular badge when popular is false', () => {
    render(<PricingCard {...defaultProps} popular={false} />)
    expect(screen.queryByText('Most Popular')).not.toBeInTheDocument()
  })
})

describe('BillingToggle', () => {
  it('renders monthly and yearly buttons', () => {
    const setBilling = vi.fn()
    render(<BillingToggle billing="monthly" setBilling={setBilling} />)
    expect(screen.getByText('Monthly')).toBeInTheDocument()
    expect(screen.getByText('Yearly')).toBeInTheDocument()
  })

  it('calls setBilling with monthly when monthly is clicked', () => {
    const setBilling = vi.fn()
    render(<BillingToggle billing="monthly" setBilling={setBilling} />)
    fireEvent.click(screen.getByText('Monthly'))
    expect(setBilling).toHaveBeenCalledWith('monthly')
  })

  it('calls setBilling with yearly when yearly is clicked', () => {
    const setBilling = vi.fn()
    render(<BillingToggle billing="monthly" setBilling={setBilling} />)
    fireEvent.click(screen.getByText('Yearly'))
    expect(setBilling).toHaveBeenCalledWith('yearly')
  })
})
