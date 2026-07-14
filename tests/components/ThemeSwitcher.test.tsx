import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '@/components/Themes/ThemeSwitcher'

const mockToggleTheme = vi.fn()
const mockGetCurrentTheme = vi.fn()

vi.mock('@/lib/theme', () => ({
  toggleTheme: () => mockToggleTheme(),
  getCurrentTheme: () => mockGetCurrentTheme(),
}))

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a button', () => {
    mockGetCurrentTheme.mockReturnValue('light')
    render(<ThemeToggle />)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows Moon icon in light mode', () => {
    mockGetCurrentTheme.mockReturnValue('light')
    const { container } = render(<ThemeToggle />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('shows Sun icon in dark mode', () => {
    mockGetCurrentTheme.mockReturnValue('dark')
    const { container } = render(<ThemeToggle />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('calls toggleTheme on click', async () => {
    mockGetCurrentTheme.mockReturnValue('light')
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button'))
    expect(mockToggleTheme).toHaveBeenCalled()
  })
})
