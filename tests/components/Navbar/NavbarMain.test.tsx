import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSession } from 'next-auth/react'
import { createWrapper } from '../../utils/renderWithProviders'

vi.mock('next-auth/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-auth/react')>()
  return {
    ...actual,
    useSession: vi.fn(),
  }
})

vi.mock('@/hooks/useFeatures', () => ({
  useIsFocuraAdmin: () => ({ data: false }),
}))

vi.mock('@/lib/auth/logout', () => ({
  logout: vi.fn(),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

// Import after mocking
import NavbarMain from '@/components/Navbar/NavbarMain'
const mockUseSession = vi.mocked(useSession)

describe('NavbarMain', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all nav links', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' } as any as Record<string, unknown>)
    render(<NavbarMain />, { wrapper: createWrapper() })
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Solutions')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Guides')).toBeInTheDocument()
  })

  it('shows Dashboard link when authenticated', () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: '1', name: 'Test', email: 'test@test.com' } },
      status: 'authenticated',
    } as any as Record<string, unknown>)
    render(<NavbarMain />, { wrapper: createWrapper() })
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('shows Login and Get Started when not authenticated', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' } as any as Record<string, unknown>)
    render(<NavbarMain />, { wrapper: createWrapper() })
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('shows logout button when authenticated', () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: '1', name: 'Test', email: 'test@test.com' } },
      status: 'authenticated',
    } as any as Record<string, unknown>)
    render(<NavbarMain />, { wrapper: createWrapper() })
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('toggles mobile menu', async () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' } as any as Record<string, unknown>)
    const user = userEvent.setup()
    render(<NavbarMain />, { wrapper: createWrapper() })
    
    // Mobile menu button should be present
    const menuButtons = screen.getAllByRole('button')
    const mobileToggle = menuButtons[menuButtons.length - 1]
    await user.click(mobileToggle)
    
    // Mobile nav links should appear
    const mobileLinks = screen.getAllByText('Home')
    expect(mobileLinks.length).toBeGreaterThanOrEqual(2) // desktop + mobile
  })

  it('shows logo', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' } as any as Record<string, unknown>)
    render(<NavbarMain />, { wrapper: createWrapper() })
    expect(screen.getByText('Focura')).toBeInTheDocument()
  })
})
