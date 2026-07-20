import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectBasicInfoSection } from '@/components/Dashboard/Projects/NewProject/ProjectBasicInfoSection'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}))

vi.mock('lucide-react', () => ({
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="alert-circle" {...props} />,
  Palette: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="palette" {...props} />,
}))

const defaultForm = {
  name: '',
  description: '',
  color: '',
  icon: '',
  status: 'ACTIVE' as const,
}

const defaultProps = {
  form: defaultForm,
  errors: {} as Record<string, string>,
  onFieldChange: vi.fn(),
}

describe('ProjectBasicInfoSection', () => {
  it('renders the Basic Info heading', () => {
    render(<ProjectBasicInfoSection {...defaultProps} />)
    expect(screen.getByText('Basic Info')).toBeInTheDocument()
  })

  it('renders the Project Name label', () => {
    render(<ProjectBasicInfoSection {...defaultProps} />)
    expect(screen.getByText('Project Name')).toBeInTheDocument()
  })

  it('renders the Description label', () => {
    render(<ProjectBasicInfoSection {...defaultProps} />)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('renders status options', () => {
    render(<ProjectBasicInfoSection {...defaultProps} />)
    expect(screen.getByText('PLANNING')).toBeInTheDocument()
    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
  })
})
