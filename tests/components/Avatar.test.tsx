import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from '@/components/Shared/Avatar'

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

describe('Avatar', () => {
  it('renders image when image prop is provided', () => {
    render(<Avatar image="https://example.com/avatar.jpg" name="Alice" />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    expect(img).toHaveAttribute('alt', 'Alice')
  })

  it('renders initial when no image', () => {
    render(<Avatar name="Alice" />)

    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('capitalizes initial', () => {
    render(<Avatar name="bob" />)

    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('renders ? for empty name', () => {
    render(<Avatar name="" />)

    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('applies sm size class', () => {
    const { container } = render(<Avatar name="Alice" size="sm" />)

    expect(container.firstChild).toHaveClass('w-7', 'h-7')
  })

  it('applies md size class by default', () => {
    const { container } = render(<Avatar name="Alice" />)

    expect(container.firstChild).toHaveClass('w-9', 'h-9')
  })

  it('applies lg size class', () => {
    const { container } = render(<Avatar name="Alice" size="lg" />)

    expect(container.firstChild).toHaveClass('w-11', 'h-11')
  })

  it('applies consistent color based on name', () => {
    const { container: c1 } = render(<Avatar name="Alice" />)
    const { container: c2 } = render(<Avatar name="Alice" />)

    // Same name should produce same color class
    expect(c1.firstChild).toEqual(c2.firstChild)
  })
})
