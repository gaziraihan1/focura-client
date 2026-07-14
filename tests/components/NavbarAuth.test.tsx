import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NavbarAuth from '@/components/Navbar/NavbarAuth'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

vi.mock('@/components/Themes/ThemeSwitcher', () => ({
  default: () => <div data-testid="theme-switcher" />,
}))

describe('NavbarAuth', () => {
  it('renders the Focura logo text', () => {
    render(<NavbarAuth />)

    expect(screen.getByText('Focura')).toBeInTheDocument()
  })

  it('renders "Back to Home" link', () => {
    render(<NavbarAuth />)

    const link = screen.getByText('Back to Home')
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders logo image', () => {
    render(<NavbarAuth />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/icon.png')
    expect(img).toHaveAttribute('alt', 'Focura')
  })

  it('renders ThemeSwitcher', () => {
    render(<NavbarAuth />)

    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument()
  })

  it('has sticky header styling', () => {
    const { container } = render(<NavbarAuth />)

    const header = container.querySelector('header')
    expect(header).toHaveClass('border-b', 'border-border')
  })
})
