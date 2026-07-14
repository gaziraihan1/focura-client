import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthFormHeader } from '@/components/Authentication/AuthForm/AuthFormHeader'
import { AuthFormFooter } from '@/components/Authentication/AuthForm/AuthFormFooter'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('AuthForm Components', () => {
  describe('AuthFormHeader', () => {
    it('renders login mode header', () => {
      render(<AuthFormHeader mode="login" />)
      expect(screen.getByText('Welcome back')).toBeInTheDocument()
      expect(screen.getByText('Sign in to')).toBeInTheDocument()
      expect(screen.getByText('Focura')).toBeInTheDocument()
      expect(screen.getByText('Enter your credentials to continue.')).toBeInTheDocument()
    })

    it('renders register mode header', () => {
      render(<AuthFormHeader mode="register" />)
      expect(screen.getByText('Get started')).toBeInTheDocument()
      expect(screen.getByText('Create your')).toBeInTheDocument()
      expect(screen.getByText('account')).toBeInTheDocument()
      expect(screen.getByText('Join Focura for free — no credit card required.')).toBeInTheDocument()
    })
  })

  describe('AuthFormFooter', () => {
    it('renders login mode footer', () => {
      render(<AuthFormFooter mode="login" />)
      expect(screen.getByText('No account yet?')).toBeInTheDocument()
      const link = screen.getByText('Create one')
      expect(link).toHaveAttribute('href', '/authentication/registration')
    })

    it('renders register mode footer', () => {
      render(<AuthFormFooter mode="register" />)
      expect(screen.getByText('Already have an account?')).toBeInTheDocument()
      const link = screen.getByText('Sign in')
      expect(link).toHaveAttribute('href', '/authentication/login')
    })
  })
})
