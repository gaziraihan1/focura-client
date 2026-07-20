import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserAvatar } from '@/components/Dashboard/Analytics/WorkspaceUsage/UserAvatar'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

describe('UserAvatar', () => {
  it('renders initials when no image', () => {
    render(<UserAvatar name="John Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders single initial for single name', () => {
    render(<UserAvatar name="Alice" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('renders image when provided', () => {
    render(<UserAvatar name="John" image="/avatar.jpg" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/avatar.jpg')
  })

  it('applies sm size class by default', () => {
    const { container } = render(<UserAvatar name="John" />)
    const avatar = container.firstChild as HTMLElement
    expect(avatar.className).toContain('w-8')
    expect(avatar.className).toContain('h-8')
  })

  it('applies md size class when specified', () => {
    const { container } = render(<UserAvatar name="John" size="md" />)
    const avatar = container.firstChild as HTMLElement
    expect(avatar.className).toContain('w-10')
    expect(avatar.className).toContain('h-10')
  })
})
