import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import NotificationBell from '@/components/Notifications/NotificationBell'

const mockHandleToggle = vi.fn()

// Mock the useNotificationBell hook
vi.mock('@/hooks/useNotificationBell', () => ({
  useNotificationBell: () => ({
    showDropdown: false,
    notifications: [],
    recentNotifications: [],
    unreadCount: 0,
    badge: null,
    isLoading: false,
    isMarkingAllAsRead: false,
    handleToggleDropdown: mockHandleToggle,
    handleCloseDropdown: vi.fn(),
    handleNotificationClick: vi.fn(),
    handleMarkAllAsRead: vi.fn(),
    formatTimeAgo: vi.fn(() => 'just now'),
  }),
}))

// Mock child components
vi.mock('@/components/Notifications/NotificationBellButton', () => ({
  NotificationBellButton: ({ badge, onClick }: Record<string, unknown>) => (
    <button data-testid="bell-button" onClick={onClick}>
      Bell {badge ? `(${badge})` : ''}
    </button>
  ),
}))

vi.mock('@/components/Notifications/NotificationDropdown', () => ({
  NotificationDropdown: () => <div data-testid="dropdown">Dropdown</div>,
}))

describe('NotificationBell', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders bell button', () => {
    render(<NotificationBell />)

    expect(screen.getByTestId('bell-button')).toBeInTheDocument()
  })

  it('does not show dropdown initially', () => {
    render(<NotificationBell />)

    expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument()
  })

  it('calls handleToggleDropdown on bell click', () => {
    render(<NotificationBell />)

    fireEvent.click(screen.getByTestId('bell-button'))
    expect(mockHandleToggle).toHaveBeenCalled()
  })
})
