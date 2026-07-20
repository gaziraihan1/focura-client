import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorState from '@/components/VerifyEmail/ErrorState'
import SuccessState from '@/components/VerifyEmail/SuccessState'
import LoadingState from '@/components/VerifyEmail/LoadingState'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('VerifyEmail States', () => {
  describe('ErrorState', () => {
    it('renders error message', () => {
      render(<ErrorState message="Token expired" />)
      expect(screen.getByText('Token expired')).toBeInTheDocument()
    })

    it('renders verification failed heading', () => {
      render(<ErrorState message="Error" />)
      expect(screen.getByText('Verification Failed')).toBeInTheDocument()
    })

    it('renders login link', () => {
      render(<ErrorState message="Error" />)
      const link = screen.getByText('Go to Login')
      expect(link).toHaveAttribute('href', '/authentication/login')
    })
  })

  describe('SuccessState', () => {
    it('renders success message', () => {
      render(<SuccessState message="Email verified successfully" />)
      expect(screen.getByText('Email verified successfully')).toBeInTheDocument()
    })

    it('renders email verified heading', () => {
      render(<SuccessState message="Done" />)
      expect(screen.getByText('Email Verified!')).toBeInTheDocument()
    })

    it('shows redirecting message', () => {
      render(<SuccessState message="Done" />)
      expect(screen.getByText('Redirecting to login page...')).toBeInTheDocument()
    })
  })

  describe('LoadingState', () => {
    it('renders verifying heading', () => {
      render(<LoadingState />)
      expect(screen.getByText('Verifying Your Email')).toBeInTheDocument()
    })

    it('shows please wait message', () => {
      render(<LoadingState />)
      expect(screen.getByText('Please wait...')).toBeInTheDocument()
    })
  })
})
