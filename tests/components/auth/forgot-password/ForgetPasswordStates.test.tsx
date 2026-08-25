import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorState from '@/components/auth/forgot-password/ErrorState'
import SuccessState from '@/components/auth/forgot-password/SuccessState'

describe('ForgetPassword States', () => {
  describe('ErrorState', () => {
    it('renders error message', () => {
      render(<ErrorState error="Email not found" />)
      expect(screen.getByText('Email not found')).toBeInTheDocument()
    })
  })

  describe('SuccessState', () => {
    it('renders success message', () => {
      render(<SuccessState />)
      expect(screen.getByText('Password reset link sent! Check your email.')).toBeInTheDocument()
    })
  })
})
