import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntegrationsSettingsForm } from '@/components/Settings/IntegrationsSettingsForm'
import { createWrapper } from '@/tests/utils/renderWithProviders'

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />
    C.displayName = name
    return C
  }
  return {
    Globe: icon('Globe'),
    Github: icon('Github'),
    MessageSquare: icon('MessageSquare'),
    Calendar: icon('Calendar'),
    Save: icon('Save'),
    Loader2: icon('Loader2'),
    ExternalLink: icon('ExternalLink'),
    Check: icon('Check'),
  }
})

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: createWrapper() })
}

describe('IntegrationsSettingsForm', () => {
  let mockApiGet: ReturnType<typeof vi.fn>
  let mockApiPost: ReturnType<typeof vi.fn>
  let mockApiDelete: ReturnType<typeof vi.fn>
  let mockToastSuccess: ReturnType<typeof vi.fn>
  let mockToastError: ReturnType<typeof vi.fn>

  beforeAll(() => {
    global.confirm = vi.fn(() => true)
  })

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.mocked(global.confirm).mockReturnValue(true)
    const { api } = await import('@/lib/axios')
    mockApiGet = api.get as ReturnType<typeof vi.fn>
    mockApiPost = api.post as ReturnType<typeof vi.fn>
    mockApiDelete = api.delete as ReturnType<typeof vi.fn>
    const { default: toast } = await import('react-hot-toast') as { default: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> } }
    mockToastSuccess = toast.success
    mockToastError = toast.error

    mockApiGet.mockResolvedValue({
      success: true,
      data: [
        { id: 'int-1', name: 'GitHub', provider: 'github', active: true, connectedAt: '2024-01-01T00:00:00.000Z' },
      ],
    })
    mockApiPost.mockResolvedValue({ success: true })
    mockApiDelete.mockResolvedValue({ success: true })
  })

  afterEach(() => {
    vi.mocked(global.confirm).mockReturnValue(true)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('shows loading state initially', () => {
    mockApiGet.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true, data: [] }), 100)))

    renderWithProviders(<IntegrationsSettingsForm />)

    expect(screen.getByTestId('icon-Loader2')).toBeInTheDocument()
  })

  it('renders available integrations after loading', async () => {
    renderWithProviders(<IntegrationsSettingsForm />)

    await waitFor(() => {
      expect(screen.getByText('Available Integrations')).toBeInTheDocument()
      expect(screen.getByText('GitHub')).toBeInTheDocument()
      expect(screen.getByText('Slack')).toBeInTheDocument()
      expect(screen.getByText('Google Calendar')).toBeInTheDocument()
    })
  })

  it('shows connected status for active integrations', async () => {
    renderWithProviders(<IntegrationsSettingsForm />)

    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument()
      expect(screen.getByText('Disconnect')).toBeInTheDocument()
    })
  })

  it('shows connect button for inactive integrations', async () => {
    renderWithProviders(<IntegrationsSettingsForm />)

    await waitFor(() => {
      const slackConnect = screen.getAllByText('Connect')
      expect(slackConnect.length).toBeGreaterThan(0)
    })
  })

  it('calls API to connect integration', async () => {
    renderWithProviders(<IntegrationsSettingsForm />)

    await waitFor(() => {
      const slackConnect = screen.getAllByText('Connect')[0]
      expect(slackConnect).toBeInTheDocument()
    })
  })

  it('calls API to disconnect integration', async () => {
    renderWithProviders(<IntegrationsSettingsForm />)

    await waitFor(() => {
      const disconnectButton = screen.getByText('Disconnect')
      expect(disconnectButton).toBeInTheDocument()
    })
  })

  it('shows confirm dialog before disconnecting', async () => {
    vi.mocked(global.confirm).mockReturnValue(false)

    renderWithProviders(<IntegrationsSettingsForm />)

    await waitFor(() => {
      const disconnectButton = screen.getByText('Disconnect')
      userEvent.click(disconnectButton)
    })

    await waitFor(() => {
      expect(mockApiDelete).not.toHaveBeenCalled()
    })
  })

  it('shows loading spinner while connecting', async () => {
    let resolveConnect: (value: unknown) => void
    mockApiPost.mockImplementation(() => new Promise(resolve => { resolveConnect = resolve }))

    renderWithProviders(<IntegrationsSettingsForm />)

    await waitFor(() => {
      const slackConnect = screen.getAllByText('Connect')[0]
      userEvent.click(slackConnect)
      expect(screen.getByTestId('icon-Loader2')).toBeInTheDocument()
      resolveConnect!({ success: true })
    })
  })

  it('shows error toast on connect failure', async () => {
    mockApiPost.mockRejectedValueOnce(new Error('API Error'))

    renderWithProviders(<IntegrationsSettingsForm />)

    await waitFor(() => {
      expect(screen.getAllByText('Connect')[0]).toBeInTheDocument()
    })

    await userEvent.click(screen.getAllByText('Connect')[0])

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Failed to connect slack')
    })
  })

  it('shows error toast on disconnect failure', async () => {
    mockApiDelete.mockRejectedValueOnce(new Error('API Error'))

    renderWithProviders(<IntegrationsSettingsForm />)

    await waitFor(() => {
      expect(screen.getByText('Disconnect')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Disconnect'))

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Failed to disconnect GitHub')
    })
  })

  it('renders globe, github, message square, and calendar icons', async () => {
    renderWithProviders(<IntegrationsSettingsForm />)

    await waitFor(() => {
      expect(screen.getByTestId('icon-Globe')).toBeInTheDocument()
      expect(screen.getByTestId('icon-Github')).toBeInTheDocument()
      expect(screen.getByTestId('icon-MessageSquare')).toBeInTheDocument()
      expect(screen.getByTestId('icon-Calendar')).toBeInTheDocument()
    })
  })

  it('refetches integrations after connecting', async () => {
    renderWithProviders(<IntegrationsSettingsForm />)

    await waitFor(() => {
      expect(screen.getAllByText('Connect')[0]).toBeInTheDocument()
    })

    await userEvent.click(screen.getAllByText('Connect')[0])

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalledTimes(2)
    })
  })
})