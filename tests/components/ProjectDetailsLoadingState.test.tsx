import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingState from '@/components/Dashboard/ProjectDetails/LoadingState'

describe('ProjectDetails LoadingState', () => {
  it('renders loading message', () => {
    render(<LoadingState />)
    expect(screen.getByText('Loading project...')).toBeInTheDocument()
  })

  it('renders spinner', () => {
    const { container } = render(<LoadingState />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })
})
