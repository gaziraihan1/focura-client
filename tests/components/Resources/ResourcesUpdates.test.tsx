import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResourcesUpdates from '@/components/Resources/ResourcesUpdates'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}))

vi.mock('lucide-react', () => ({
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="chevron-left" {...props} />,
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="chevron-right" {...props} />,
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => <a href={href} {...props}>{children}</a>,
}))

const mockUpdates = {
  items: [
    { id: '1', slug: 'v2-release', title: 'Version 2.0', description: 'Major release', version: 'v2.0', date: '2025-02-01', status: 'PUBLIC' as const, createdAt: '2025-02-01', updatedAt: '2025-02-01' },
    { id: '2', slug: 'v2.1-patch', title: 'Bug Fixes', description: 'Patched issues', version: 'v2.1', date: '2025-03-01', status: 'PUBLIC' as const, createdAt: '2025-03-01', updatedAt: '2025-03-01' },
  ],
  total: 2,
  page: 1,
  limit: 6,
  totalPages: 1,
}

describe('ResourcesUpdates', () => {
  it('renders the section heading', () => {
    render(<ResourcesUpdates updates={mockUpdates} />)
    expect(screen.getByText('Latest Product Updates')).toBeInTheDocument()
  })

  it('renders update titles', () => {
    render(<ResourcesUpdates updates={mockUpdates} />)
    expect(screen.getByText('Version 2.0')).toBeInTheDocument()
    expect(screen.getByText('Bug Fixes')).toBeInTheDocument()
  })

  it('renders version badges', () => {
    render(<ResourcesUpdates updates={mockUpdates} />)
    expect(screen.getByText('v2.0')).toBeInTheDocument()
    expect(screen.getByText('v2.1')).toBeInTheDocument()
  })

  it('renders update descriptions', () => {
    render(<ResourcesUpdates updates={mockUpdates} />)
    expect(screen.getByText('Major release')).toBeInTheDocument()
    expect(screen.getByText('Patched issues')).toBeInTheDocument()
  })
})
