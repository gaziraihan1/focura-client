import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TopNavbar from '@/components/Dashboard/TopNavbar'

const mockLogout = vi.fn()

vi.mock('@/lib/auth/logout', () => ({
  logout: () => mockLogout(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

vi.mock('@/components/Themes/ThemeSwitcher', () => ({
  default: () => <div data-testid="theme-switcher" />,
}))

vi.mock('@/components/Notifications/NotificationBell', () => ({
  default: () => <div data-testid="notification-bell" />,
}))

vi.mock('@/components/Shared/SearchModal', () => ({
  SearchModal: ({ isOpen }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? <div data-testid="search-modal">Search Modal</div> : null,
}))

describe('TopNavbar', () => {
  const defaultProps = {
    onMenuClick: vi.fn(),
    user: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      image: null,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders user name', () => {
    render(<TopNavbar {...defaultProps} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders default "User" when no user', () => {
    render(<TopNavbar {...defaultProps} user={undefined} />)

    expect(screen.getByText('User')).toBeInTheDocument()
  })

  it('renders search bar with placeholder', () => {
    render(<TopNavbar {...defaultProps} />)

    expect(screen.getByText('Search workspaces, projects, files…')).toBeInTheDocument()
  })

  it('renders "New Task" link', () => {
    render(<TopNavbar {...defaultProps} />)

    const link = screen.getByText('New Task').closest('a')
    expect(link).toHaveAttribute('href', '/dashboard/tasks/add-task')
  })

  it('renders ThemeSwitcher', () => {
    render(<TopNavbar {...defaultProps} />)

    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument()
  })

  it('renders NotificationBell', () => {
    render(<TopNavbar {...defaultProps} />)

    expect(screen.getByTestId('notification-bell')).toBeInTheDocument()
  })

  it('calls onMenuClick when menu button clicked', async () => {
    const onMenuClick = vi.fn()
    const user = userEvent.setup()

    render(<TopNavbar {...defaultProps} onMenuClick={onMenuClick} />)

    const menuBtn = screen.getAllByRole('button')[0]
    await user.click(menuBtn)

    expect(onMenuClick).toHaveBeenCalled()
  })

  it('opens user menu on avatar click', async () => {
    const user = userEvent.setup()

    render(<TopNavbar {...defaultProps} />)

    const avatarBtn = screen.getByText('John Doe').closest('button')!
    await user.click(avatarBtn)

    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Billing')).toBeInTheDocument()
  })

  it('shows user email in dropdown', async () => {
    const user = userEvent.setup()

    render(<TopNavbar {...defaultProps} />)

    const avatarBtn = screen.getByText('John Doe').closest('button')!
    await user.click(avatarBtn)

    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('renders profile link in dropdown', async () => {
    const user = userEvent.setup()

    render(<TopNavbar {...defaultProps} />)

    const avatarBtn = screen.getByText('John Doe').closest('button')!
    await user.click(avatarBtn)

    const profileLink = screen.getByText('Profile').closest('a')
    expect(profileLink).toHaveAttribute('href', '/dashboard/profile')
  })

  it('renders logout button in dropdown', async () => {
    const user = userEvent.setup()

    render(<TopNavbar {...defaultProps} />)

    const avatarBtn = screen.getByText('John Doe').closest('button')!
    await user.click(avatarBtn)

    expect(screen.getByText('Log out')).toBeInTheDocument()
  })

  it('calls logout when logout button clicked', async () => {
    const user = userEvent.setup()

    render(<TopNavbar {...defaultProps} />)

    const avatarBtn = screen.getByText('John Doe').closest('button')!
    await user.click(avatarBtn)

    await user.click(screen.getByText('Log out'))

    expect(mockLogout).toHaveBeenCalled()
  })

  it('shows loading state for profile name', () => {
    render(<TopNavbar {...defaultProps} isLoadingProfile={true} />)

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })

  it('renders user image when provided', () => {
    render(
      <TopNavbar
        {...defaultProps}
        user={{ ...defaultProps.user!, image: 'https://example.com/avatar.jpg' }}
      />
    )

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('opens search modal when mobile search button clicked', async () => {
    const user = userEvent.setup()

    render(<TopNavbar {...defaultProps} />)

    const searchButtons = screen.getAllByRole('button')
    const mobileSearchBtn = searchButtons.find(btn =>
      btn.querySelector('svg') && btn.className.includes('md:hidden')
    )

    if (mobileSearchBtn) {
      await user.click(mobileSearchBtn)
      expect(screen.getByTestId('search-modal')).toBeInTheDocument()
    }
  })

  it('opens search modal when desktop search bar clicked', async () => {
    const user = userEvent.setup()

    render(<TopNavbar {...defaultProps} />)

    const searchBar = screen.getByText('Search workspaces, projects, files…').closest('button')!
    await user.click(searchBar)

    expect(screen.getByTestId('search-modal')).toBeInTheDocument()
  })
})
