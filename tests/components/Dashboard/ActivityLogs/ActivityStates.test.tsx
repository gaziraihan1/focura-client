import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { ActivityEmptyState } from '@/components/Dashboard/ActivityLogs/ActivityEmptyState'
import { ActivityErrorState } from '@/components/Dashboard/ActivityLogs/ActivityErrorState'
import { ActivityLoadingState } from '@/components/Dashboard/ActivityLogs/ActivityLoadingState'
import { ActivityPageHeader } from '@/components/Dashboard/ActivityLogs/ActivityPageHeader'

describe('ActivityEmptyState', () => {
  it('renders "No activities found" text', () => {
    render(<ActivityEmptyState />)
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
