import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectStats } from '@/components/Dashboard/AllProjects/ProjectStats'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}))

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />
  return {
    FolderKanban: icon('FolderKanban'),
    Sparkles: icon('Sparkles'),
    CheckCircle2: icon('CheckCircle2'),
    TrendingUp: icon('TrendingUp'),
  }
})

describe('ProjectStats', () => {
  const props = { total: 10, active: 5, completed: 3, totalTasks: 42 }

  it('renders all stat labels', () => {
    render(<ProjectStats {...props} />)
    expect(screen.getByText('Total Projects')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
  })

  it('renders correct stat values', () => {
    render(<ProjectStats {...props} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
