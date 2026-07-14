import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthFormButtons } from '@/components/Authentication/AuthForm/AuthFormButtons'
import { AuthFormFields } from '@/components/Authentication/AuthForm/AuthFormFields'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('AuthFormButtons', () => {
  it('renders sign in button for login mode', () => {
    render(<AuthFormButtons mode="login" isLoading={false} isSubmitting={false} isGoogleLoading={false} onGoogleClick={vi.fn()} />)
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('renders create account button for register mode', () => {
    render(<AuthFormButtons mode="register" isLoading={false} isSubmitting={false} isGoogleLoading={false} onGoogleClick={vi.fn()} />)
    expect(screen.getByText('Create account')).toBeInTheDocument()
  })

  it('renders google button', () => {
    render(<AuthFormButtons mode="login" isLoading={false} isSubmitting={false} isGoogleLoading={false} onGoogleClick={vi.fn()} />)
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
  })

  it('calls onGoogleClick when google button is clicked', () => {
    const onGoogleClick = vi.fn()
    render(<AuthFormButtons mode="login" isLoading={false} isSubmitting={false} isGoogleLoading={false} onGoogleClick={onGoogleClick} />)
    fireEvent.click(screen.getByText('Continue with Google'))
    expect(onGoogleClick).toHaveBeenCalled()
  })

  it('disables buttons when loading', () => {
    render(<AuthFormButtons mode="login" isLoading={true} isSubmitting={false} isGoogleLoading={false} onGoogleClick={vi.fn()} />)
    const signInButton = screen.getByText('Sign in').closest('button')
    expect(signInButton).toBeDisabled()
  })

  it('shows loading spinner when submitting', () => {
    render(<AuthFormButtons mode="login" isLoading={false} isSubmitting={true} isGoogleLoading={false} onGoogleClick={vi.fn()} />)
    const submitButton = screen.getByText('Sign in').closest('button')
    expect(submitButton).toHaveClass('disabled:opacity-50')
  })

  it('renders or divider', () => {
    render(<AuthFormButtons mode="login" isLoading={false} isSubmitting={false} isGoogleLoading={false} onGoogleClick={vi.fn()} />)
    expect(screen.getByText('or')).toBeInTheDocument()
  })
})

describe('AuthFormFields', () => {
  it('renders email and password for login mode', () => {
    const register = vi.fn()
    render(<AuthFormFields mode="login" register={register as any} errors={{}} isLoading={false} />)
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('renders name field for register mode', () => {
    const register = vi.fn()
    render(<AuthFormFields mode="register" register={register as any} errors={{}} isLoading={false} />)
    expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument()
  })

  it('renders forgot password link for login mode', () => {
    const register = vi.fn()
    render(<AuthFormFields mode="login" register={register as any} errors={{}} isLoading={false} />)
    const link = screen.getByText('Forgot password?')
    expect(link).toHaveAttribute('href', '/authentication/forgot-password')
  })

  it('does not render forgot password link for register mode', () => {
    const register = vi.fn()
    render(<AuthFormFields mode="register" register={register as any} errors={{}} isLoading={false} />)
    expect(screen.queryByText('Forgot password?')).not.toBeInTheDocument()
  })
})
