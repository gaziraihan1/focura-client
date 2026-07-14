import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BillingToggle from '@/components/Pricing/BillingToggle'

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props}>{props.children}</div>,
  },
}))

describe('BillingToggle', () => {
  it('renders Monthly and Yearly buttons', () => {
    render(<BillingToggle billing="monthly" setBilling={vi.fn()} />)
    expect(screen.getByText('Monthly')).toBeInTheDocument()
    expect(screen.getByText('Yearly')).toBeInTheDocument()
  })

  it('calls setBilling with "yearly" when Yearly clicked', async () => {
    const setBilling = vi.fn()
    const user = userEvent.setup()
    render(<BillingToggle billing="monthly" setBilling={setBilling} />)

    await user.click(screen.getByText('Yearly'))
    expect(setBilling).toHaveBeenCalledWith('yearly')
  })

  it('calls setBilling with "monthly" when Monthly clicked', async () => {
    const setBilling = vi.fn()
    const user = userEvent.setup()
    render(<BillingToggle billing="yearly" setBilling={setBilling} />)

    await user.click(screen.getByText('Monthly'))
    expect(setBilling).toHaveBeenCalledWith('monthly')
  })
})
