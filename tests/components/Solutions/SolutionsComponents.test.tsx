import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...filterDomProps(props)}>{children}</div>,
    button: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <button {...filterDomProps(props)}>{children}</button>,
    span: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <span {...filterDomProps(props)}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
  useInView: () => true,
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}))

function filterDomProps(props: Record<string, unknown>) {
  const domProps: Record<string, unknown> = {}
  for (const key of Object.keys(props)) {
    if (!key.startsWith('initial') && !key.startsWith('animate') && !key.startsWith('while') && !key.startsWith('exit') && !key.startsWith('transition') && !key.startsWith('viewport') && !key.startsWith('layout')) {
      domProps[key] = props[key]
    }
  }
  return domProps
}

import SolutionsHero from '@/components/Solutions/SolutionsHero'

describe('SolutionsHero', () => {
  it('renders solutions badge', () => {
    render(<SolutionsHero />)
    expect(screen.getByText('Solutions for Modern Teams')).toBeInTheDocument()
  })

  it('renders heading', () => {
    render(<SolutionsHero />)
    expect(screen.getByText(/Designed to solve the/)).toBeInTheDocument()
    expect(screen.getByText('real')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<SolutionsHero />)
    expect(screen.getByText(/From project alignment to team communication/)).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<SolutionsHero />)
    expect(screen.getByText('Explore Solutions')).toBeInTheDocument()
    expect(screen.getByText('Watch Demo')).toBeInTheDocument()
  })
})
