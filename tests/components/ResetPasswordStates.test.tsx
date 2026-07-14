import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InvalidResetTokenState } from '@/components/Reset-password/InvalidResetTokenState'
import { ResetPasswordPageHeader } from '@/components/Reset-password/ResetPasswordPageHeader'
import { ResetPasswordPageAlerts } from '@/components/Reset-password/ResetPasswordPageAlerts'
import { ResetPasswordPageFooter } from '@/components/Reset-password/ResetPasswordPageFooter'
import { ResetPasswordLoadingFallback } from '@/components/Reset-password/ResetPasswordLoadingFallback'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('Reset Password States', () => {
  describe('InvalidResetTokenState', () => {
    it('renders invalid reset link heading', () => {
      render(<InvalidResetTokenState />)
      expect(screen.getByText('Invalid Reset Link')).toBeInTheDocument()
    })

    it('renders invalid token message', () => {
      render(<InvalidResetTokenState />)
      expect(screen.getByText('This password reset link is invalid or has expired.')).toBeInTheDocument()
    })

    it('renders request new link button', () => {
      render(<InvalidResetTokenState />)
      const link = screen.getByText('Request New Link')
      expect(link).toHaveAttribute('href', '/authentication/forgot-password')
    })
  })

  describe('ResetPasswordPageHeader', () => {
    it('renders reset password heading', () => {
      render(<ResetPasswordPageHeader />)
      expect(screen.getByText('Reset Password')).toBeInTheDocument()
    })

    it('renders enter new password subtitle', () => {
      render(<ResetPasswordPageHeader />)
      expect(screen.getByText('Enter your new password')).toBeInTheDocument()
    })
  })

  describe('ResetPasswordPageAlerts', () => {
    it('renders error message when error is provided', () => {
      render(<ResetPasswordPageAlerts error="Token expired" success={false} />)
      expect(screen.getByText('Token expired')).toBeInTheDocument()
    })

    it('renders success message when success is true', () => {
      render(<ResetPasswordPageAlerts error="" success={true} />)
      expect(screen.getByText('Password reset successfully!')).toBeInTheDocument()
      expect(screen.getByText('Redirecting to login...')).toBeInTheDocument()
    })

    it('renders nothing when no error and not success', () => {
      const { container } = render(<ResetPasswordPageAlerts error="" success={false} />)
      expect(container.innerHTML).toBe('')
    })
  })

  describe('ResetPasswordPageFooter', () => {
    it('renders remember your password text', () => {
      render(<ResetPasswordPageFooter />)
      expect(screen.getByText(/Remember your password/)).toBeInTheDocument()
    })

    it('renders login link', () => {
      render(<ResetPasswordPageFooter />)
      const link = screen.getByText('Login')
      expect(link).toHaveAttribute('href', '/authentication/login')
    })
  })

  describe('ResetPasswordLoadingFallback', () => {
    it('renders loading spinner', () => {
      const { container } = render(<ResetPasswordLoadingFallback />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })
})
