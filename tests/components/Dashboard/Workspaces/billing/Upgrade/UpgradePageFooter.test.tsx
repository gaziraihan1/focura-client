import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { UpgradePageFooter } from '@/components/Dashboard/Workspaces/billing/Upgrade/UpgradePageFooter'

describe('UpgradePageFooter', () => {
  it('renders billing info', () => {
    render(<UpgradePageFooter />)
    expect(screen.getByText(/All plans are billed per workspace/)).toBeInTheDocument()
  })

  it('renders Stripe info', () => {
    render(<UpgradePageFooter />)
    expect(screen.getByText(/Payments processed securely by Stripe/)).toBeInTheDocument()
  })
})
