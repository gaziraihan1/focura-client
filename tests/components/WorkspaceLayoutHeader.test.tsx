import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WorkspaceLayoutHeader } from '@/components/Dashboard/Workspaces/WorkspaceLayoutHeader'

vi.mock('lucide-react', () => ({
  Menu: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Search: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

vi.mock('@/components/Themes/ThemeSwitcher', () => ({
  default: () => <div data-testid="theme-switcher">Theme</div>,
}))

describe('WorkspaceLayoutHeader', () => {
  const defaultProps = {
    session: { user: { name: 'John', image: null } } as any,
    onSidebarOpen: vi.fn(),
    onSwitcherOpen: vi.fn(),
  }

  it('renders search input', () => {
    render(<WorkspaceLayoutHeader {...defaultProps} />)
    expect(screen.getByPlaceholderText(/Search or press/)).toBeInTheDocument()
  })

  it('renders user initials when no image', () => {
    render(<WorkspaceLayoutHeader {...defaultProps} />)
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('renders user image when available', () => {
    render(
      <WorkspaceLayoutHeader
        {...defaultProps}
        session={{ user: { name: 'John', image: '/avatar.jpg' } } as any}
      />
    )
    const img = screen.getByAltText('User')
    expect(img).toBeInTheDocument()
  })

  it('renders theme switcher', () => {
    render(<WorkspaceLayoutHeader {...defaultProps} />)
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument()
  })

  it('calls onSwitcherOpen when search is clicked', () => {
    render(<WorkspaceLayoutHeader {...defaultProps} />)
    screen.getByPlaceholderText(/Search or press/).click()
    expect(defaultProps.onSwitcherOpen).toHaveBeenCalled()
  })
})
