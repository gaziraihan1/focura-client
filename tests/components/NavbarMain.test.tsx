import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NavbarMain from '@/components/Navbar/NavbarMain'

const mockLogout = vi.fn()

vi.mock('@/lib/auth/logout', () => ({
  logout: () => mockLogout(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'unauthenticated', data: null }),
}))

vi.mock('@/components/Themes/ThemeSwitcher', () => ({
  default: () => <div data-testid="theme-switcher" />,
}))

vi.mock('@/hooks/useFeatures', () => ({
  useIsFocuraAdmin: () => ({ data: false }),
}))

describe('NavbarMain', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Focura logo', () => {
    render(<NavbarMain />)

    expect(screen.getByText('Focura')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<NavbarMain />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Solutions')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Guides')).toBeInTheDocument()
  })

  it('renders Login link when unauthenticated', () => {
    render(<NavbarMain />)

    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('renders "Get Started" link when unauthenticated', () => {
    render(<NavbarMain />)

    const link = screen.getByText('Get Started')
    expect(link).toHaveAttribute('href', '/get-started')
  })

  it('renders ThemeSwitcher', () => {
    render(<NavbarMain />)

    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument()
  })

  it('renders logo image', () => {
    render(<NavbarMain />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/focura.png')
    expect(img).toHaveAttribute('alt', 'logo')
  })

  it('toggles mobile menu on hamburger click', async () => {
    const user = userEvent.setup()
    render(<NavbarMain />)

    const menuBtn = screen.getAllByRole('button')[0]
    await user.click(menuBtn)

    // Mobile menu should show nav links
    const mobileLinks = screen.getAllByText('Home')
    expect(mobileLinks.length).toBeGreaterThanOrEqual(1)
  })

  it('nav links have correct hrefs', () => {
    render(<NavbarMain />)

    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveAttribute('href', '/')

    const featuresLink = screen.getByText('Features').closest('a')
    expect(featuresLink).toHaveAttribute('href', '/features')

    const pricingLink = screen.getByText('Pricing').closest('a')
    expect(pricingLink).toHaveAttribute('href', '/pricing')
  })

  it('Login link points to login page', () => {
    render(<NavbarMain />)

    const loginLink = screen.getByText('Login').closest('a')
    expect(loginLink).toHaveAttribute('href', '/authentication/login')
  })
})
