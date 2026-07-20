import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DetailModal from '@/components/Roadmap/DetailModal'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
}))

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}))

vi.mock('lucide-react', () => ({
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x-icon" {...props} />,
}))

const mockItem = {
  id: '1',
  title: 'AI Assistant',
  description: 'Built-in AI writing assistant',
  detail: 'GPT-powered writing tools integrated into the editor',
  status: 'in-progress' as const,
  category: 'productivity' as const,
  quarter: 'Q2 2025',
  icon: '🤖',
  highlights: ['Auto-complete', 'Tone detection', 'Grammar check'],
}

describe('DetailModal', () => {
  it('renders the item title', () => {
    render(<DetailModal item={mockItem} onClose={vi.fn()} />)
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
  })

  it('renders the detail text', () => {
    render(<DetailModal item={mockItem} onClose={vi.fn()} />)
    expect(screen.getByText('GPT-powered writing tools integrated into the editor')).toBeInTheDocument()
  })

  it('renders highlights', () => {
    render(<DetailModal item={mockItem} onClose={vi.fn()} />)
    expect(screen.getByText('Auto-complete')).toBeInTheDocument()
    expect(screen.getByText('Grammar check')).toBeInTheDocument()
  })

  it('renders the Key Highlights section', () => {
    render(<DetailModal item={mockItem} onClose={vi.fn()} />)
    expect(screen.getByText('Key Highlights')).toBeInTheDocument()
  })
})
