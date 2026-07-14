import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PricingFAQ from '@/components/Pricing/PricingFaq'

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props}>{props.children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('PricingFAQ', () => {
  it('renders the heading', () => {
    render(<PricingFAQ />)
    expect(screen.getByText('Pricing FAQ')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<PricingFAQ />)
    expect(screen.getByText(/Quick answers to the most common questions/)).toBeInTheDocument()
  })

  it('renders all 5 FAQ questions', () => {
    render(<PricingFAQ />)
    expect(screen.getByText('Can I switch plans later?')).toBeInTheDocument()
    expect(screen.getByText('Do you offer refunds?')).toBeInTheDocument()
    expect(screen.getByText('Is there a free trial for premium features?')).toBeInTheDocument()
    expect(screen.getByText('Do you offer team or enterprise pricing?')).toBeInTheDocument()
    expect(screen.getByText('Will my data be secure?')).toBeInTheDocument()
  })

  it('toggles answer visibility on click', async () => {
    const user = userEvent.setup()
    render(<PricingFAQ />)

    const question = screen.getByText('Can I switch plans later?')
    await user.click(question)

    expect(screen.getByText(/Yes! You can upgrade or downgrade/)).toBeInTheDocument()
  })

  it('hides answer when clicked again', async () => {
    const user = userEvent.setup()
    render(<PricingFAQ />)

    const question = screen.getByText('Can I switch plans later?')
    await user.click(question)
    expect(screen.getByText(/Yes! You can upgrade or downgrade/)).toBeInTheDocument()

    await user.click(question)
    expect(screen.queryByText(/Yes! You can upgrade or downgrade/)).not.toBeInTheDocument()
  })
})
