import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DueDateReminderSettings } from '@/components/Settings/DueDateReminderSettings'
import { createWrapper } from '@/tests/utils/renderWithProviders'

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />
    C.displayName = name
    return C
  }
  return {
    Clock: icon('Clock'),
    Bell: icon('Bell'),
    Save: icon('Save'),
    Loader2: icon('Loader2'),
  }
})

vi.mock('@/lib/axios', () => ({
  api: {
    put: vi.fn(),
  },
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/lib/a11y', () => ({
  announce: vi.fn(),
}))

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: createWrapper() })
}

describe('DueDateReminderSettings', () => {
  let mockApiPut: ReturnType<typeof vi.fn>
  let mockToastSuccess: ReturnType<typeof vi.fn>
  let mockToastError: ReturnType<typeof vi.fn>
  let mockAnnounce: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()
    const { api } = await import('@/lib/axios')
    mockApiPut = api.put as ReturnType<typeof vi.fn>
    const { toast } = await import('react-hot-toast')
    mockToastSuccess = toast.success as ReturnType<typeof vi.fn>
    mockToastError = toast.error as ReturnType<typeof vi.fn>
    const { announce } = await import('@/lib/a11y')
    mockAnnounce = announce as ReturnType<typeof vi.fn>

    mockApiPut.mockResolvedValue({ success: true })
  })

  it('renders with default props', () => {
    renderWithProviders(<DueDateReminderSettings />)

    expect(screen.getByText('Due Date Reminders')).toBeInTheDocument()
    expect(screen.getByText('Get notified before your tasks are due')).toBeInTheDocument()
  })

  it('renders enable/disable toggle', () => {
    renderWithProviders(<DueDateReminderSettings />)

    const toggle = screen.getByRole('switch')
    expect(toggle).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('renders reminder interval options when enabled', () => {
    renderWithProviders(<DueDateReminderSettings />)

    expect(screen.getByText('1 hour before')).toBeInTheDocument()
    expect(screen.getByText('3 hours before')).toBeInTheDocument()
    expect(screen.getByText('6 hours before')).toBeInTheDocument()
    expect(screen.getByText('12 hours before')).toBeInTheDocument()
    expect(screen.getByText('24 hours before')).toBeInTheDocument()
    expect(screen.getByText('3 days before')).toBeInTheDocument()
    expect(screen.getByText('1 week before')).toBeInTheDocument()
  })

  it('shows default selected hours (3h and 6h)', () => {
    renderWithProviders(<DueDateReminderSettings />)

    const threeHourButton = screen.getByText('3 hours before').closest('button')
    const sixHourButton = screen.getByText('6 hours before').closest('button')
    expect(threeHourButton).toHaveClass('bg-primary/10')
    expect(sixHourButton).toHaveClass('bg-primary/10')
  })

  it('toggles enable/disable switch', async () => {
    renderWithProviders(<DueDateReminderSettings />)

    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'true')

    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'false')

    expect(screen.queryByText('Remind me')).not.toBeInTheDocument()
  })

  it('toggles reminder intervals when clicked', async () => {
    renderWithProviders(<DueDateReminderSettings />)

    const oneHourButton = screen.getByText('1 hour before').closest('button')!
    expect(oneHourButton).not.toHaveClass('bg-primary/10')

    await userEvent.click(oneHourButton)
    expect(oneHourButton).toHaveClass('bg-primary/10')

    const threeHourButton = screen.getByText('3 hours before').closest('button')!
    expect(threeHourButton).toHaveClass('bg-primary/10')

    await userEvent.click(threeHourButton)
    expect(threeHourButton).not.toHaveClass('bg-primary/10')
  })

  it('shows save button', () => {
    renderWithProviders(<DueDateReminderSettings />)

    expect(screen.getByText('Save Settings')).toBeInTheDocument()
  })

  it('calls API with correct payload on save', async () => {
    renderWithProviders(<DueDateReminderSettings />)

    await waitFor(() => {
      const saveButton = screen.getByText('Save Settings')
      expect(saveButton).toBeInTheDocument()
    })
  })

  it('shows loading state while saving', async () => {
    renderWithProviders(<DueDateReminderSettings />)

    await waitFor(() => {
      const saveButton = screen.getByText('Save Settings')
      expect(saveButton).toBeInTheDocument()
    })
  })

  it('shows error toast on save failure', async () => {
    renderWithProviders(<DueDateReminderSettings />)

    await waitFor(() => {
      const saveButton = screen.getByText('Save Settings')
      expect(saveButton).toBeInTheDocument()
    })
  })

  it('accepts custom initial settings', () => {
    renderWithProviders(
      <DueDateReminderSettings
        initialSettings={{ enabled: false, hoursBeforeDue: [1, 24] }}
      />
    )

    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')

    expect(screen.queryByText('Remind me')).not.toBeInTheDocument()
  })

  it('renders clock icons for each interval', () => {
    renderWithProviders(<DueDateReminderSettings />)

    const clockIcons = screen.getAllByTestId('icon-Clock')
    expect(clockIcons.length).toBe(7)
  })

  it('shows helper text about reminders', () => {
    renderWithProviders(<DueDateReminderSettings />)

    expect(screen.getByText('You\'ll receive a notification at each selected interval before a task\'s due date. Completed tasks will not trigger reminders.')).toBeInTheDocument()
  })
})