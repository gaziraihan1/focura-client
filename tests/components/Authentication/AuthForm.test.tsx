import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../../utils/renderWithProviders'
import AuthForm from '@/components/Authentication/AuthForm'
import { signIn } from 'next-auth/react'

// Mock next-auth
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

describe('AuthForm', () => {
  it('renders login fields correctly', () => {
    render(<AuthForm mode="login" />, { wrapper: createWrapper() })

    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('renders register fields correctly', () => {
    render(<AuthForm mode="register" />, { wrapper: createWrapper() })

    expect(screen.getByPlaceholderText(/Full name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create account/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields on submit', async () => {
    render(<AuthForm mode="login" />, { wrapper: createWrapper() })

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument()
      expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('calls signIn with correct credentials on login submit', async () => {
    render(<AuthForm mode="login" />, { wrapper: createWrapper() })

    fireEvent.change(screen.getByPlaceholderText(/Email address/i), { target: { value: 'test@focura.com' } })
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
        email: 'test@focura.com',
        password: 'password123',
        redirect: false,
      }))
    })
  })

  it('handles Google sign-in click', async () => {
    render(<AuthForm mode="login" />, { wrapper: createWrapper() })

    const googleBtn = screen.getByRole('button', { name: /Continue with Google/i })
    fireEvent.click(googleBtn)

    expect(signIn).toHaveBeenCalledWith('google', expect.any(Object))
  })
})
