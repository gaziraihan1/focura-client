import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { EmptyState } from '@/components/shared/EmptyState'
import { Clock } from 'lucide-react'
import { ActivityErrorState } from '@/components/dashboard/activity-logs/ActivityErrorState'
import { ActivityLoadingState } from '@/components/dashboard/activity-logs/ActivityLoadingState'
import { ActivityPageHeader } from '@/components/dashboard/activity-logs/ActivityPageHeader'

describe('ActivityEmptyState', () => {
  it('renders "No activities found" text', () => {
    render(<EmptyState icon={Clock} title="No activities found" description="Activity will appear here as changes are made" />)
    expect(screen.getByText('No activities found')).toBeInTheDocument()
  })
})

describe('ActivityErrorState', () => {
  it('renders error message text', () => {
    render(<ActivityErrorState />)
    expect(screen.getByText(/Failed to load activities/)).toBeInTheDocument()
  })
})

describe('ActivityLoadingState', () => {
  it('renders loader/spinner', () => {
    render(<ActivityLoadingState />)
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })
})

describe('ActivityPageHeader', () => {
  it('renders "Activity Feed" heading', () => {
    render(<ActivityPageHeader onRefresh={vi.fn()} onClearAll={vi.fn()} />)
    expect(screen.getByText('Activity Feed')).toBeInTheDocument()
  })

  it('shows Refresh and Clear All buttons', () => {
    render(<ActivityPageHeader onRefresh={vi.fn()} onClearAll={vi.fn()} />)
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument()
  })

  it('calls onRefresh when Refresh clicked', async () => {
    const user = userEvent.setup()
    const onRefresh = vi.fn()
    render(<ActivityPageHeader onRefresh={onRefresh} onClearAll={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /refresh/i }))
    expect(onRefresh).toHaveBeenCalledTimes(1)
  })

  it('calls onClearAll when Clear All clicked', async () => {
    const user = userEvent.setup()
    const onClearAll = vi.fn()
    render(<ActivityPageHeader onRefresh={vi.fn()} onClearAll={onClearAll} />)
    await user.click(screen.getByRole('button', { name: /clear all/i }))
    expect(onClearAll).toHaveBeenCalledTimes(1)
  })
})
