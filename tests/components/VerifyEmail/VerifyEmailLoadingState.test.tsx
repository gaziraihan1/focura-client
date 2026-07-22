import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingState from '@/components/VerifyEmail/LoadingState'

describe('VerifyEmail LoadingState', () => {
  it('renders "Verifying Your Email" heading', () => {
    render(<LoadingState />)
    expect(screen.getByText('Verifying Your Email')).toBeInTheDocument()
  })

  it('renders "Please wait..." text', () => {
    render(<LoadingState />)
    expect(screen.getByText('Please wait...')).toBeInTheDocument()
  })

  it('renders spinning loader', () => {
    const { container } = render(<LoadingState />)
    const spinner = container.querySelector('svg')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin')
  })
})
