import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('framer-motion', () => ({
  motion: { div: (p: Record<string, unknown>) => <div {...p} /> },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

import { Section } from '@/components/Dashboard/TeamTask/Section'
import { Stat } from '@/components/Dashboard/TeamTask/Stat'

describe('Section', () => {
  it('renders title', () => {
    render(<Section title="Team Tasks"><div>Content</div></Section>)
    expect(screen.getByText('Team Tasks')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Section title="Tasks"><span>Child content</span></Section>)
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })
})

describe('Stat', () => {
  it('renders label and value', () => {
    render(<Stat label="Total" value={10} />)
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders with color variant', () => {
    render(<Stat label="Active" value={5} variant="primary" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
