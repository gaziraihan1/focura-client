import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LayoutWrapper from '@/components/Wrapper/LayoutWrapper'

const mockPathname = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

vi.mock('@/components/Navbar/NavbarMain', () => ({
  default: () => <nav data-testid="navbar-main">Navbar</nav>,
}))

vi.mock('@/components/Footer/FooterMain', () => ({
  default: () => <footer data-testid="footer-main">Footer</footer>,
}))

vi.mock('@/components/Navbar/NavbarAuth', () => ({
  default: () => <nav data-testid="navbar-auth">Auth Nav</nav>,
}))

describe('LayoutWrapper', () => {
  it('renders children', () => {
    mockPathname.mockReturnValue('/')
    render(
      <LayoutWrapper>
        <div>Test Content</div>
      </LayoutWrapper>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('shows navbar and footer on public routes', () => {
    mockPathname.mockReturnValue('/')
    render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    )
    expect(screen.getByTestId('navbar-main')).toBeInTheDocument()
    expect(screen.getByTestId('footer-main')).toBeInTheDocument()
  })

  it('hides navbar and footer on dashboard routes', () => {
    mockPathname.mockReturnValue('/dashboard/tasks')
    render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    )
    expect(screen.queryByTestId('navbar-main')).not.toBeInTheDocument()
    expect(screen.queryByTestId('footer-main')).not.toBeInTheDocument()
  })

  it('shows auth navbar on authentication routes', () => {
    mockPathname.mockReturnValue('/authentication/login')
    render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    )
    expect(screen.getByTestId('navbar-auth')).toBeInTheDocument()
  })

  it('hides navbar and footer on admin routes', () => {
    mockPathname.mockReturnValue('/admin-dashboard')
    render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    )
    expect(screen.queryByTestId('navbar-main')).not.toBeInTheDocument()
    expect(screen.queryByTestId('footer-main')).not.toBeInTheDocument()
  })
})
