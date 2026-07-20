import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FocusRequirementsCard } from '@/components/Dashboard/TaskDetails/FocusRequirementsCard'

vi.mock('lucide-react', () => ({
  Brain: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="brain-icon" {...props} />,
  Zap: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="zap-icon" {...props} />,
  Shield: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="shield-icon" {...props} />,
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="alert-icon" {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}))

vi.mock('@/utils/task.utils', () => ({
  getFocusLevelColor: () => 'text-purple-500',
  getEnergyTypeColor: () => 'bg-yellow-500/20 text-yellow-500',
}))

describe('FocusRequirementsCard', () => {
  it('renders focus requirements heading', () => {
    render(<FocusRequirementsCard />)
    expect(screen.getByText('Focus Requirements')).toBeInTheDocument()
  })

  it('renders focus level when provided', () => {
    render(<FocusRequirementsCard focusLevel={3} />)
    expect(screen.getByText('Focus Level')).toBeInTheDocument()
    expect(screen.getByText('3/5')).toBeInTheDocument()
  })

  it('renders correct number of focus level bars', () => {
    const { container } = render(<FocusRequirementsCard focusLevel={3} />)
    const bars = container.querySelectorAll('.bg-purple-500')
    expect(bars.length).toBe(3)
  })

  it('renders energy type when provided', () => {
    render(<FocusRequirementsCard energyType="HIGH" />)
    expect(screen.getByText('Energy Type')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('renders distraction cost when provided', () => {
    render(<FocusRequirementsCard distractionCost={4} />)
    expect(screen.getByText('Distraction Cost')).toBeInTheDocument()
    expect(screen.getByText('4/5')).toBeInTheDocument()
  })

  it('renders correct number of distraction cost bars', () => {
    const { container } = render(<FocusRequirementsCard distractionCost={2} />)
    const bars = container.querySelectorAll('.bg-blue-500')
    expect(bars.length).toBe(2)
  })

  it('hides focus level when not provided', () => {
    render(<FocusRequirementsCard />)
    expect(screen.queryByText('Focus Level')).not.toBeInTheDocument()
  })

  it('hides energy type when not provided', () => {
    render(<FocusRequirementsCard />)
    expect(screen.queryByText('Energy Type')).not.toBeInTheDocument()
  })

  it('hides distraction cost when undefined', () => {
    render(<FocusRequirementsCard />)
    expect(screen.queryByText('Distraction Cost')).not.toBeInTheDocument()
  })

  it('renders the advice text', () => {
    render(<FocusRequirementsCard />)
    expect(screen.getByText(/focused attention/)).toBeInTheDocument()
  })

  it('renders all three metrics when all provided', () => {
    render(
      <FocusRequirementsCard
        focusLevel={5}
        energyType="MEDIUM"
        distractionCost={3}
      />
    )
    expect(screen.getByText('Focus Level')).toBeInTheDocument()
    expect(screen.getByText('Energy Type')).toBeInTheDocument()
    expect(screen.getByText('Distraction Cost')).toBeInTheDocument()
  })
})
