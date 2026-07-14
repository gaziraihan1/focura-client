import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VerifyEmailContainer } from '@/components/VerifyEmail/VerifyEmailContainer'

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props}>{props.children}</div>,
  },
}))

describe('VerifyEmailContainer', () => {
  it('renders children', () => {
    render(
      <VerifyEmailContainer>
        <div>Test content</div>
      </VerifyEmailContainer>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders with centered layout', () => {
    const { container } = render(
      <VerifyEmailContainer>
        <div>Content</div>
      </VerifyEmailContainer>
    )
    const section = container.querySelector('section')
    expect(section).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center')
  })
})
