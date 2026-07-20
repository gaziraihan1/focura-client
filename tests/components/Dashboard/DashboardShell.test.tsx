import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardShell from '@/components/Dashboard/DashboardShell'

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
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

vi.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: () => ({
    data: { name: 'Test User', email: 'test@test.com' },
    isLoading: false,
    isFetching: false,
  }),
}))

vi.mock('@/components/Dashboard/Sidebar', () => ({
  default: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="Sidebar">Sidebar</div>,
}))

vi.mock('@/components/Dashboard/TopNavbar', () => ({
  default: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="TopNavbar">TopNavbar</div>,
}))

describe('DashboardShell', () => {
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
})
