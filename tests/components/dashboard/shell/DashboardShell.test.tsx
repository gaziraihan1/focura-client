import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardShell from '@/components/dashboard/shell/DashboardShell'

vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: { id: 'u1', name: 'Test', email: 'test@test.com' },
      backendToken: 'valid-token-12345',
    },
    status: 'authenticated',
  }),
  signOut: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/dashboard'),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

import { usePathname } from 'next/navigation'

vi.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: () => ({
    data: { name: 'Test User', email: 'test@test.com' },
    isLoading: false,
    isFetching: false,
  }),
}))

vi.mock('@/components/dashboard/shell/Sidebar', () => ({
  default: () => <div data-testid="Sidebar">Sidebar</div>,
}))

vi.mock('@/components/dashboard/shell/TopNavbar', () => ({
  default: () => <div data-testid="TopNavbar">TopNavbar</div>,
}))

describe('DashboardShell', () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue('/dashboard')
  })

  it('renders children when authenticated', () => {
    render(
      <DashboardShell>
        <div>Page Content</div>
      </DashboardShell>
    )
    expect(screen.getByText('Page Content')).toBeInTheDocument()
  })

  it('renders sidebar and topnavbar', () => {
    render(
      <DashboardShell>
        <div>Content</div>
      </DashboardShell>
    )
    expect(screen.getByTestId('Sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('TopNavbar')).toBeInTheDocument()
  })

  it('keeps the dashboard shell on the workspaces browse page', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard/workspaces/browse')
    render(
      <DashboardShell>
        <div>Browse Content</div>
      </DashboardShell>
    )
    expect(screen.getByTestId('Sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('TopNavbar')).toBeInTheDocument()
    expect(screen.getByText('Browse Content')).toBeInTheDocument()
  })

  it('keeps the dashboard shell on the new-workspace page', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard/workspaces/new-workspace')
    render(
      <DashboardShell>
        <div>New Workspace Content</div>
      </DashboardShell>
    )
    expect(screen.getByTestId('Sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('TopNavbar')).toBeInTheDocument()
  })

  it('hides the global shell on workspace slug routes (workspace layout provides its own)', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard/workspaces/acme')
    render(
      <DashboardShell>
        <div>Workspace Content</div>
      </DashboardShell>
    )
    expect(screen.queryByTestId('Sidebar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('TopNavbar')).not.toBeInTheDocument()
    expect(screen.getByText('Workspace Content')).toBeInTheDocument()
  })
})
