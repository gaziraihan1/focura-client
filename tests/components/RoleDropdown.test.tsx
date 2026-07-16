import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RoleDropdown } from '@/components/Dashboard/Workspaces/TeamPage/RoleDropdown'

vi.mock('lucide-react', () => ({
  ChevronDown: (props: any) => <svg data-testid="chevron-icon" {...props} />,
}))

describe('RoleDropdown', () => {
  const defaultProps = {
    variant: 'workspace' as const,
    currentRole: 'MEMBER' as const,
    onChange: vi.fn(),
    disabled: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders workspace role options', () => {
    render(<RoleDropdown {...defaultProps} />)
    const select = screen.getByRole('combobox')
    const options = Array.from(select.querySelectorAll('option'))
    const labels = options.map((o) => o.textContent)
    expect(labels).toContain('Owner')
    expect(labels).toContain('Admin')
    expect(labels).toContain('Member')
    expect(labels).toContain('Guest')
  })

  it('renders project role options', () => {
    render(
      <RoleDropdown
        variant="project"
        currentRole="COLLABORATOR"
        onChange={vi.fn()}
      />
    )
    const select = screen.getByRole('combobox')
    const options = Array.from(select.querySelectorAll('option'))
    const labels = options.map((o) => o.textContent)
    expect(labels).toContain('Manager')
    expect(labels).toContain('Collaborator')
    expect(labels).toContain('Viewer')
  })

  it('sets current role value', () => {
    render(<RoleDropdown {...defaultProps} />)
    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('MEMBER')
  })

  it('calls onChange when role is changed', () => {
    render(<RoleDropdown {...defaultProps} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'ADMIN' } })
    expect(defaultProps.onChange).toHaveBeenCalledWith('ADMIN')
  })

  it('disables select when disabled is true', () => {
    render(<RoleDropdown {...defaultProps} disabled={true} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
  })

  it('shows disabled reason as title when disabled', () => {
    render(
      <RoleDropdown
        {...defaultProps}
        disabled={true}
        disabledReason="Cannot change your own role"
      />
    )
    const wrapper = screen.getByRole('combobox').closest('div')
    expect(wrapper).toHaveAttribute('title', 'Cannot change your own role')
  })

  it('renders chevron icon', () => {
    render(<RoleDropdown {...defaultProps} />)
    expect(screen.getByTestId('chevron-icon')).toBeInTheDocument()
  })
})
