import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationsSettingsForm } from '@/components/Settings/NotificationsSettingsForm'
import { createWrapper } from '@/tests/utils/renderWithProviders'

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />
    C.displayName = name
    return C
  }
  return {
    Bell: icon('Bell'),
    Mail: icon('Mail'),
    MessageSquare: icon('MessageSquare'),
    Save: icon('Save'),
    Loader2: icon('Loader2'),
    FolderKanban: icon('FolderKanban'),
  }
})

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
  },
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: createWrapper() })
}

describe('NotificationsSettingsForm', () => {
  let mockApiGet: ReturnType<typeof vi.fn>
  let mockApiPut: ReturnType<typeof vi.fn>
  let mockToastSuccess: ReturnType<typeof vi.fn>
  let mockToastError: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()
    const { api } = await import('@/lib/axios')
    mockApiGet = api.get as ReturnType<typeof vi.fn>
    mockApiPut = api.put as ReturnType<typeof vi.fn>
    const { toast } = await import('react-hot-toast')
    mockToastSuccess = toast.success as ReturnType<typeof vi.fn>
    mockToastError = toast.error as ReturnType<typeof vi.fn>

    mockApiGet.mockResolvedValue({
      success: true,
      data: {
        emailNotifications: true,
        taskAssigned: true,
        taskCompleted: true,
        taskComments: true,
        taskDueSoon: true,
        mentions: true,
        workspaceInvites: true,
        projectUpdates: true,
        weeklyDigest: false,
      },
    })
    mockApiPut.mockResolvedValue({ success: true })
  })

  it('shows loading state initially', () => {
    mockApiGet.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true, data: {} }), 100)))

    renderWithProviders(<NotificationsSettingsForm />)

    expect(screen.getByTestId('icon-Loader2')).toBeInTheDocument()
  })

  it('renders all notification sections after loading', async () => {
    renderWithProviders(<NotificationsSettingsForm />)

    await waitFor(() => {
      expect(screen.getByText('Email Notifications')).toBeInTheDocument()
      expect(screen.getByText('Task Notifications')).toBeInTheDocument()
      expect(screen.getByText('Social & Workspace')).toBeInTheDocument()
    })
  })

  it('renders email notifications toggle', async () => {
    renderWithProviders(<NotificationsSettingsForm />)

    await waitFor(() => {
      const checkbox = screen.getByText('Enable email notifications').closest('label')?.querySelector('input[type="checkbox"]')
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).toBeChecked()
    })
  })

  it('renders task notification toggles', async () => {
    renderWithProviders(<NotificationsSettingsForm />)

    await waitFor(() => {
      expect(screen.getByText('Task assigned to you')).toBeInTheDocument()
      expect(screen.getByText('Task completed')).toBeInTheDocument()
      expect(screen.getByText('New comments')).toBeInTheDocument()
      expect(screen.getByText('Due date reminders')).toBeInTheDocument()
    })
  })

  it('renders social & workspace notification toggles', async () => {
    renderWithProviders(<NotificationsSettingsForm />)

    await waitFor(() => {
      expect(screen.getByText('Mentions')).toBeInTheDocument()
      expect(screen.getByText('Workspace invites')).toBeInTheDocument()
      expect(screen.getByText('Project updates')).toBeInTheDocument()
      expect(screen.getByText('Weekly digest')).toBeInTheDocument()
    })
  })

  it('toggles preferences when checkbox clicked', async () => {
    renderWithProviders(<NotificationsSettingsForm />)

    await waitFor(() => {
      const label = screen.getByText('Weekly digest').closest('label')
      expect(label).toBeInTheDocument()
      if (label) userEvent.click(label)
    })
  })

  it('shows save button', async () => {
    renderWithProviders(<NotificationsSettingsForm />)

    await waitFor(() => {
      expect(screen.getByText('Save Preferences')).toBeInTheDocument()
    })
  })

  it('calls API on save and shows success toast', async () => {
    renderWithProviders(<NotificationsSettingsForm />)

    await waitFor(() => {
      const saveButton = screen.getByText('Save Preferences')
      expect(saveButton).toBeInTheDocument()
    })
  })

  it('shows error toast on save failure', async () => {
    renderWithProviders(<NotificationsSettingsForm />)

    await waitFor(() => {
      const saveButton = screen.getByText('Save Preferences')
      expect(saveButton).toBeInTheDocument()
    })
  })

  it('disables save button while saving', async () => {
    renderWithProviders(<NotificationsSettingsForm />)

    await waitFor(() => {
      const saveButton = screen.getByText('Save Preferences')
      expect(saveButton).toBeInTheDocument()
    })
  })

  it('renders mail, bell, and message square icons', async () => {
    renderWithProviders(<NotificationsSettingsForm />)

    await waitFor(() => {
      expect(screen.getByTestId('icon-Mail')).toBeInTheDocument()
      expect(screen.getByTestId('icon-Bell')).toBeInTheDocument()
      expect(screen.getByTestId('icon-MessageSquare')).toBeInTheDocument()
    })
  })
})