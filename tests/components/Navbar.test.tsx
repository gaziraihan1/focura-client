import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import NavbarAuth from '@/components/Navbar/NavbarAuth'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

vi.mock('@/components/Themes/ThemeSwitcher', () => ({
  default: () => <div data-testid="theme-switcher">Theme</div>,
}))

describe('NavbarAuth', () => {
  it('renders Focura brand', () => {
    render(<NavbarAuth />)
    const brandLinks = screen.getAllByText('Focura')
    expect(brandLinks.length).toBeGreaterThan(0)
  })

  it('renders back to home link', () => {
    render(<NavbarAuth />)
    const link = screen.getByText('Back to Home')
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders theme switcher', () => {
    render(<NavbarAuth />)
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument()
  })

  it('renders brand logo link to home', () => {
    render(<NavbarAuth />)
    const links = screen.getAllByRole('link')
    const homeLink = links.find(link => link.getAttribute('href') === '/')
    expect(homeLink).toBeInTheDocument()
  })
})
