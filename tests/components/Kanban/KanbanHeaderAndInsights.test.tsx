import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

// ─── KanbanHeader ────────────────────────────────────────────────────────────
import { KanbanHeader } from '@/components/Dashboard/KanbanView/KanbanHeader'

describe('KanbanHeader', () => {
  const defaultProps = {
    scope: 'personal' as const,
    onScopeChange: vi.fn(),
    taskCounts: { total: 10, inProgress: 3, blocked: 1 },
    focusMode: false,
    onFocusModeChange: vi.fn(),
  }

  it('renders the heading', () => {
    render(<KanbanHeader {...defaultProps} />)
    expect(screen.getByText('Kanban')).toBeInTheDocument()
  })

  it('renders task counts', () => {
    render(<KanbanHeader {...defaultProps} />)
    expect(screen.getByText('10 tasks')).toBeInTheDocument()
    expect(screen.getByText('3 in progress')).toBeInTheDocument()
    expect(screen.getByText('1 blocked')).toBeInTheDocument()
  })

  it('renders scope buttons', () => {
    render(<KanbanHeader {...defaultProps} />)
    expect(screen.getByText('personal')).toBeInTheDocument()
    expect(screen.getByText('assigned')).toBeInTheDocument()
    expect(screen.getByText('team')).toBeInTheDocument()
  })

  it('calls onScopeChange when scope button is clicked', () => {
    const onScopeChange = vi.fn()
    render(<KanbanHeader {...defaultProps} onScopeChange={onScopeChange} />)
    fireEvent.click(screen.getByText('team'))
    expect(onScopeChange).toHaveBeenCalledWith('team')
  })

  it('calls onFocusModeChange when focus button is clicked', () => {
    const onFocusModeChange = vi.fn()
    render(<KanbanHeader {...defaultProps} onFocusModeChange={onFocusModeChange} />)
    fireEvent.click(screen.getByText('Focus').closest('button')!)
    expect(onFocusModeChange).toHaveBeenCalledWith(true)
  })

  it('shows Focus as active when focusMode is true', () => {
    render(<KanbanHeader {...defaultProps} focusMode={true} />)
    const focusBtn = screen.getByText('Focus').closest('button')!
    expect(focusBtn.className).toContain('bg-primary')
  })

  it('hides blocked count when zero', () => {
    render(<KanbanHeader {...defaultProps} taskCounts={{ total: 5, inProgress: 2, blocked: 0 }} />)
    expect(screen.queryByText('0 blocked')).not.toBeInTheDocument()
  })

  it('hides progress coloring when zero', () => {
    render(<KanbanHeader {...defaultProps} taskCounts={{ total: 5, inProgress: 0, blocked: 0 }} />)
    expect(screen.getByText('0 in progress')).toBeInTheDocument()
  })
})

// ─── KanbanInsightsButton ────────────────────────────────────────────────────
import { KanbanInsightsButton } from '@/components/Dashboard/KanbanView/KanbanInsightsButton'

describe('KanbanInsightsButton', () => {
  it('renders Show Insights when showInsights is false', () => {
    render(<KanbanInsightsButton showInsights={false} onToggle={vi.fn()} />)
    expect(screen.getByText('Show Insights')).toBeInTheDocument()
  })

  it('renders nothing when showInsights is true', () => {
    const { container } = render(<KanbanInsightsButton showInsights={true} onToggle={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<KanbanInsightsButton showInsights={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByText('Show Insights'))
    expect(onToggle).toHaveBeenCalledOnce()
  })
})

// ─── NotificationsContent ────────────────────────────────────────────────────
import { NotificationsContent } from '@/components/Dashboard/Notifications/NotificationsContent'

describe('NotificationsContent', () => {
  const defaultProps = {
    notifications: [] as any[],
    isLoading: false,
    hasNextPage: false,
    isFetchingNextPage: false,
    onNotificationClick: vi.fn(),
    onNotificationDelete: vi.fn(),
    onLoadMore: vi.fn(),
  }

  it('shows loading state when isLoading is true', () => {
    const { container } = render(<NotificationsContent {...defaultProps} isLoading={true} />)
    const placeholders = container.querySelectorAll('.animate-pulse')
    expect(placeholders.length).toBe(5)
  })

  it('shows empty state when not loading and no notifications', () => {
    render(<NotificationsContent {...defaultProps} />)
    expect(screen.getByText('No notifications yet')).toBeInTheDocument()
  })

  it('shows notifications when available', () => {
    const notifications = [
      { id: '1', title: 'Test', message: 'Message', read: false, createdAt: new Date().toISOString() },
    ]
    render(<NotificationsContent {...defaultProps} notifications={notifications} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Message')).toBeInTheDocument()
  })

  it('shows load more button when hasNextPage is true', () => {
    const notifications = [
      { id: '1', title: 'Test', message: 'Message', read: false, createdAt: new Date().toISOString() },
    ]
    render(<NotificationsContent {...defaultProps} notifications={notifications} hasNextPage={true} />)
    expect(screen.getByText('Load More')).toBeInTheDocument()
  })

  it('shows end of list message when no more pages', () => {
    const notifications = [
      { id: '1', title: 'Test', message: 'Message', read: false, createdAt: new Date().toISOString() },
    ]
    render(<NotificationsContent {...defaultProps} notifications={notifications} hasNextPage={false} />)
    expect(screen.getByText(/reached the end/)).toBeInTheDocument()
  })
})

// ─── NotificationsList ───────────────────────────────────────────────────────
import { NotificationsList } from '@/components/Dashboard/Notifications/NotificationsList'

describe('NotificationsList', () => {
  const notifications = [
    { id: '1', title: 'First', message: 'First message', read: false, createdAt: new Date().toISOString() },
    { id: '2', title: 'Second', message: 'Second message', read: true, createdAt: new Date().toISOString() },
  ]

  it('renders all notifications', () => {
    render(<NotificationsList notifications={notifications} onNotificationClick={vi.fn()} onNotificationDelete={vi.fn()} />)
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })
})

// ─── DeleteNotificationsDialog ───────────────────────────────────────────────
import { DeleteNotificationsDialog } from '@/components/Dashboard/Notifications/DeleteNotificationsDialog'

describe('DeleteNotificationsDialog', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(<DeleteNotificationsDialog isOpen={false} isPending={false} onClose={vi.fn()} onConfirm={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders the dialog when isOpen is true', () => {
    render(<DeleteNotificationsDialog isOpen={true} isPending={false} onClose={vi.fn()} onConfirm={vi.fn()} />)
    expect(screen.getByText(/Delete Read Notifications/)).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn()
    render(<DeleteNotificationsDialog isOpen={true} isPending={false} onClose={vi.fn()} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onClose when cancel button is clicked', () => {
    const onClose = vi.fn()
    render(<DeleteNotificationsDialog isOpen={true} isPending={false} onClose={onClose} onConfirm={vi.fn()} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('disables delete button when isPending', () => {
    render(<DeleteNotificationsDialog isOpen={true} isPending={true} onClose={vi.fn()} onConfirm={vi.fn()} />)
    expect(screen.getByText('Delete').closest('button')).toBeDisabled()
  })
})
