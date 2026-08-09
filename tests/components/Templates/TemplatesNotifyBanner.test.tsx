import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`${name}-icon`} {...props} />
    Component.displayName = name
    return Component
  }
  return {
    Crown: icon('Crown'),
    Sparkles: icon('Sparkles'),
    ArrowRight: icon('ArrowRight'),
  }
})

import TemplatesNotifyBanner from '@/components/Templates/TemplatesNotifyBanner'

describe('TemplatesNotifyBanner', () => {
  it('renders heading', () => {
    render(<TemplatesNotifyBanner />)
    expect(screen.getByText(/Every plan starts with free templates/)).toBeInTheDocument()
  })

  it('renders all three tier cards', () => {
    render(<TemplatesNotifyBanner />)
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('Business')).toBeInTheDocument()
  })

  it('renders a link to the pricing page', () => {
    render(<TemplatesNotifyBanner />)
    const link = screen.getByText('Compare plans').closest('a')
    expect(link).toHaveAttribute('href', '/pricing')
  })
})
