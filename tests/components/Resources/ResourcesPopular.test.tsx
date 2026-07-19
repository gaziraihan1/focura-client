import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResourcesPopular from '@/components/Resources/ResourcesPopular'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

vi.mock('lucide-react', () => ({
  ChevronLeft: (props: any) => <svg data-testid="chevron-left" {...props} />,
  ChevronRight: (props: any) => <svg data-testid="chevron-right" {...props} />,
}))

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

const mockData = {
  items: [
    { id: '1', slug: 'guide-1', title: 'Getting Started Guide', description: 'A beginner guide', image: '/img1.jpg', category: 'Guide', status: 'PUBLIC' as const, createdById: 'u1', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
    { id: '2', slug: 'tool-1', title: 'Top Tools', description: 'Best tools list', image: '/img2.jpg', category: 'Tool', status: 'PUBLIC' as const, createdById: 'u1', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  ],
  total: 2,
  page: 1,
  limit: 6,
  totalPages: 1,
}

describe('ResourcesPopular', () => {
  it('renders the section heading', () => {
    render(<ResourcesPopular data={mockData} />)
    expect(screen.getByText('Popular Resources')).toBeInTheDocument()
  })

  it('renders resource titles', () => {
    render(<ResourcesPopular data={mockData} />)
    expect(screen.getByText('Getting Started Guide')).toBeInTheDocument()
    expect(screen.getByText('Top Tools')).toBeInTheDocument()
  })

  it('renders resource descriptions', () => {
    render(<ResourcesPopular data={mockData} />)
    expect(screen.getByText('A beginner guide')).toBeInTheDocument()
    expect(screen.getByText('Best tools list')).toBeInTheDocument()
  })

  it('renders resource categories', () => {
    render(<ResourcesPopular data={mockData} />)
    expect(screen.getByText('Guide')).toBeInTheDocument()
    expect(screen.getByText('Tool')).toBeInTheDocument()
  })
})
