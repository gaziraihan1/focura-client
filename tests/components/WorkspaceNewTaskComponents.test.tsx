import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { IntentSelector } from '@/components/Dashboard/WorkspaceNewTask/IntentSelector'
import { EnergySelector } from '@/components/Dashboard/WorkspaceNewTask/EnergySelector'

vi.mock('lucide-react', () => ({
  Zap: (props: any) => <svg data-testid="zap-icon" {...props} />,
  Brain: (props: any) => <svg data-testid="brain-icon" {...props} />,
  AlertCircle: (props: any) => <svg data-testid="alert-icon" {...props} />,
  Clock: (props: any) => <svg data-testid="clock-icon" {...props} />,
  Users: (props: any) => <svg data-testid="users-icon" {...props} />,
}))

describe('IntentSelector', () => {
  const defaultProps = {
    selectedIntent: undefined as string | undefined,
    onIntentChange: vi.fn(),
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders Task Intent label', () => {
    render(<IntentSelector {...defaultProps} />)
    expect(screen.getByText('Task Intent')).toBeInTheDocument()
  })

  it('renders all 5 intent options', () => {
    render(<IntentSelector {...defaultProps} />)
    expect(screen.getByText('Execution')).toBeInTheDocument()
    expect(screen.getByText('Planning')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(screen.getByText('Learning')).toBeInTheDocument()
    expect(screen.getByText('Communication')).toBeInTheDocument()
  })

  it('renders intent descriptions', () => {
    render(<IntentSelector {...defaultProps} />)
    expect(screen.getByText(/Build, implement/)).toBeInTheDocument()
    expect(screen.getByText(/Think, design/)).toBeInTheDocument()
  })

  it('calls onIntentChange when Execution is clicked', () => {
    render(<IntentSelector {...defaultProps} />)
    fireEvent.click(screen.getByText('Execution'))
    expect(defaultProps.onIntentChange).toHaveBeenCalledWith('EXECUTION')
  })

  it('calls onIntentChange when Planning is clicked', () => {
    render(<IntentSelector {...defaultProps} />)
    fireEvent.click(screen.getByText('Planning'))
    expect(defaultProps.onIntentChange).toHaveBeenCalledWith('PLANNING')
  })

  it('calls onIntentChange when Review is clicked', () => {
    render(<IntentSelector {...defaultProps} />)
    fireEvent.click(screen.getByText('Review'))
    expect(defaultProps.onIntentChange).toHaveBeenCalledWith('REVIEW')
  })

  it('calls onIntentChange when Learning is clicked', () => {
    render(<IntentSelector {...defaultProps} />)
    fireEvent.click(screen.getByText('Learning'))
    expect(defaultProps.onIntentChange).toHaveBeenCalledWith('LEARNING')
  })

  it('calls onIntentChange when Communication is clicked', () => {
    render(<IntentSelector {...defaultProps} />)
    fireEvent.click(screen.getByText('Communication'))
    expect(defaultProps.onIntentChange).toHaveBeenCalledWith('COMMUNICATION')
  })
})

describe('EnergySelector', () => {
  const defaultProps = {
    selectedEnergy: undefined as string | undefined,
    onEnergyChange: vi.fn(),
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders Ideal Energy label', () => {
    render(<EnergySelector {...defaultProps} />)
    expect(screen.getByText('Ideal Energy')).toBeInTheDocument()
  })

  it('renders all 3 energy options', () => {
    render(<EnergySelector {...defaultProps} />)
    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('calls onEnergyChange when Low is clicked', () => {
    render(<EnergySelector {...defaultProps} />)
    fireEvent.click(screen.getByText('Low'))
    expect(defaultProps.onEnergyChange).toHaveBeenCalledWith('LOW')
  })

  it('calls onEnergyChange when Medium is clicked', () => {
    render(<EnergySelector {...defaultProps} />)
    fireEvent.click(screen.getByText('Medium'))
    expect(defaultProps.onEnergyChange).toHaveBeenCalledWith('MEDIUM')
  })

  it('calls onEnergyChange when High is clicked', () => {
    render(<EnergySelector {...defaultProps} />)
    fireEvent.click(screen.getByText('High'))
    expect(defaultProps.onEnergyChange).toHaveBeenCalledWith('HIGH')
  })

  it('highlights selected energy', () => {
    render(<EnergySelector {...defaultProps} selectedEnergy="HIGH" />)
    const highBtn = screen.getByText('High')
    expect(highBtn.className).toContain('border-red-500')
  })
})
