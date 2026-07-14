import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SuccessState from '@/components/VerifyEmail/SuccessState'

describe('VerifyEmail SuccessState', () => {
  it('renders "Email Verified!" heading', () => {
    render(<SuccessState message="Your email has been verified." />)
    expect(screen.getByText('Email Verified!')).toBeInTheDocument()
  })

  it('renders the provided message', () => {
    render(<SuccessState message="Your email has been verified." />)
    expect(screen.getByText('Your email has been verified.')).toBeInTheDocument()
  })

  it('renders "Redirecting to login page..." text', () => {
    render(<SuccessState message="Done" />)
    expect(screen.getByText('Redirecting to login page...')).toBeInTheDocument()
  })

  it('renders check circle icon', () => {
    const { container } = render(<SuccessState message="Done" />)
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('text-green-500')
  })
})
