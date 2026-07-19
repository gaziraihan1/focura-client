import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { UpgradePageHeader } from '@/components/Dashboard/Workspaces/billing/Upgrade/UpgradePageHeader'

describe('UpgradePageHeader', () => {
  it('renders the heading', () => {
    render(<UpgradePageHeader onBack={vi.fn()} />)
    expect(screen.getByText('Choose a plan for this workspace')).toBeInTheDocument()
  })

  it('renders the workspace upgrade badge', () => {
    render(<UpgradePageHeader onBack={vi.fn()} />)
    expect(screen.getByText('Workspace upgrade')).toBeInTheDocument()
  })

  it('calls onBack when back button clicked', async () => {
    const onBack = vi.fn()
    const user = userEvent.setup()
    render(<UpgradePageHeader onBack={onBack} />)
    await user.click(screen.getByText('Back to billing'))
    expect(onBack).toHaveBeenCalled()
  })
})
