import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SecuritySettingsForm } from '@/components/Settings/SecuritySettingsForm'
import { createWrapper } from '@/tests/utils/renderWithProviders'

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />
    C.displayName = name
    return C
  }
  return {
    Lock: icon('Lock'),
    Shield: icon('Shield'),
    Save: icon('Save'),
    Loader2: icon('Loader2'),
    Eye: icon('Eye'),
    EyeOff: icon('EyeOff'),
    Smartphone: icon('Smartphone'),
    Monitor: icon('Monitor'),
    Laptop: icon('Laptop'),
    SmartphoneIcon: icon('SmartphoneIcon'),
    LogOut: icon('LogOut'),
    Copy: icon('Copy'),
    CheckCircle2: icon('CheckCircle2'),
    AlertTriangle: icon('AlertTriangle'),
    XCircle: icon('XCircle'),
  }
})

vi.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value, size, level }: { value: string; size: number; level: string }) => (
    <svg data-testid="qrcode" data-value={value} data-size={size} data-level={level} />
  ),
}))

// Mutable mocks for hooks that need per-test overrides
const mockSecuritySettings = vi.fn()
const mockSetupTwoFactor = vi.fn()
const mockVerifyTwoFactor = vi.fn()
const mockDisableTwoFactor = vi.fn()

vi.mock('@/hooks/useSecurity', () => {
  return {
    useChangePassword: () => ({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    }),
    useActiveSessions: () => ({
      data: [
        {
          id: 'session-1',
          device: 'Chrome on Mac',
          browser: 'Chrome',
          os: 'macOS',
          ip: '192.168.1.1',
          location: 'New York, US',
          lastActiveAt: '2024-01-15T10:00:00.000Z',
          createdAt: '2024-01-15T09:00:00.000Z',
          isCurrent: true,
        },
        {
          id: 'session-2',
          device: 'Safari on iPhone',
          browser: 'Safari',
          os: 'iOS',
          ip: '192.168.1.2',
          location: 'Los Angeles, US',
          lastActiveAt: '2024-01-14T15:00:00.000Z',
          createdAt: '2024-01-14T14:00:00.000Z',
          isCurrent: false,
        },
      ],
      isLoading: false,
    }),
    useRevokeSession: () => ({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    }),
    useRevokeAllSessions: () => ({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    }),
    useSecuritySettings: () => mockSecuritySettings(),
    useSetupTwoFactor: () => mockSetupTwoFactor(),
    useVerifyTwoFactor: () => mockVerifyTwoFactor(),
    useDisableTwoFactor: () => mockDisableTwoFactor(),
    validatePasswordStrength: (password: string) => ({
      score: password.length >= 12 ? 5 : password.length >= 8 ? 3 : 1,
      feedback: [],
    }),
  }
})

// Mock window.confirm
global.confirm = vi.fn(() => true)

vi.mock('@/lib/a11y', () => ({
  announce: vi.fn(),
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

describe('SecuritySettingsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set default mock implementations
    mockSecuritySettings.mockReturnValue({
      data: { twoFactorEnabled: false, emailVerified: true, lastPasswordChange: null },
      isLoading: false,
    })
    mockSetupTwoFactor.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({
        secret: 'MOCKBASE32SECRET',
        uri: 'otpauth://totp/Focura:test@test.com?secret=MOCKBASE32SECRET&issuer=Focura',
      }),
      isPending: false,
    })
    mockVerifyTwoFactor.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    })
    mockDisableTwoFactor.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    })
  })

  it('renders all sections correctly', () => {
    renderWithProviders(<SecuritySettingsForm />)

    expect(screen.getByText('Change Password')).toBeInTheDocument()
    expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument()
    expect(screen.getByText('Active Sessions')).toBeInTheDocument()
  })

  it('renders password fields with labels', () => {
    renderWithProviders(<SecuritySettingsForm />)

    expect(screen.getByLabelText('Current Password')).toBeInTheDocument()
    expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    renderWithProviders(<SecuritySettingsForm />)

    const currentToggle = screen.getByLabelText('Show current password')
    await userEvent.click(currentToggle)
    expect(screen.getByLabelText('Hide current password')).toBeInTheDocument()

    const newToggle = screen.getByLabelText('Show new password')
    await userEvent.click(newToggle)
    expect(screen.getByLabelText('Hide new password')).toBeInTheDocument()
  })

  it('shows password strength indicator when typing', async () => {
    renderWithProviders(<SecuritySettingsForm />)

    const newPasswordInput = screen.getByLabelText('New Password')
    await userEvent.type(newPasswordInput, 'StrongPass123!')

    await waitFor(() => {
      expect(screen.getByText('Strong password')).toBeInTheDocument()
    })
  })

  it('shows weak password warning for short passwords', async () => {
    renderWithProviders(<SecuritySettingsForm />)

    const newPasswordInput = screen.getByLabelText('New Password')
    await userEvent.type(newPasswordInput, 'weak')

    await waitFor(() => {
      expect(screen.getByText('Weak password')).toBeInTheDocument()
    })
  })

  it('shows password mismatch error', async () => {
    renderWithProviders(<SecuritySettingsForm />)

    const newPasswordInput = screen.getByLabelText('New Password')
    const confirmInput = screen.getByLabelText('Confirm New Password')

    await userEvent.type(newPasswordInput, 'password123')
    await userEvent.type(confirmInput, 'different123')

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('disables save button when passwords do not match', async () => {
    renderWithProviders(<SecuritySettingsForm />)

    const saveButton = screen.getByText('Update Password')
    expect(saveButton).toBeDisabled()

    const currentPasswordInput = screen.getByLabelText('Current Password')
    const newPasswordInput = screen.getByLabelText('New Password')
    const confirmInput = screen.getByLabelText('Confirm New Password')

    await userEvent.type(currentPasswordInput, 'oldpassword')
    await userEvent.type(newPasswordInput, 'password123')
    await userEvent.type(confirmInput, 'password123')

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled()
    })
  })

  it('renders active sessions list', () => {
    renderWithProviders(<SecuritySettingsForm />)

    expect(screen.getByText('Chrome')).toBeInTheDocument()
    expect(screen.getByText('Safari')).toBeInTheDocument()
    expect(screen.getByText('Current')).toBeInTheDocument()
  })

  it('shows revoke button for non-current sessions', () => {
    renderWithProviders(<SecuritySettingsForm />)

    const revokeButton = screen.getByLabelText('Revoke Safari session')
    expect(revokeButton).toBeInTheDocument()
  })

  it('does not show revoke button for current session', () => {
    renderWithProviders(<SecuritySettingsForm />)

    expect(screen.queryByLabelText('Revoke Chrome session')).not.toBeInTheDocument()
  })

  it('shows revoke all others button when multiple sessions', () => {
    renderWithProviders(<SecuritySettingsForm />)

    expect(screen.getByText('Revoke All Others')).toBeInTheDocument()
  })

  it('shows 2FA status when not configured', () => {
    renderWithProviders(<SecuritySettingsForm />)

    expect(screen.getByText('Not Configured')).toBeInTheDocument()
    expect(screen.getByText('Set Up')).toBeInTheDocument()
  })

  it('shows 2FA enabled status when configured', () => {
    mockSecuritySettings.mockReturnValue({
      data: { twoFactorEnabled: true, emailVerified: true, lastPasswordChange: null },
      isLoading: false,
    })

    renderWithProviders(<SecuritySettingsForm />)

    expect(screen.getByText('Enabled')).toBeInTheDocument()
    expect(screen.getByText('Disable')).toBeInTheDocument()
  })

  it('shows setup button in idle state', () => {
    renderWithProviders(<SecuritySettingsForm />)

    expect(screen.getByText('Set Up')).toBeInTheDocument()
    expect(screen.queryByText('Disable')).not.toBeInTheDocument()
  })

  it('renders QR code when setup is initiated', async () => {
    renderWithProviders(<SecuritySettingsForm />)

    const setupButton = screen.getByText('Set Up')
    await userEvent.click(setupButton)

    await waitFor(() => {
      expect(screen.getByTestId('qrcode')).toBeInTheDocument()
    })
  })

  it('shows verification input after QR code is displayed', async () => {
    renderWithProviders(<SecuritySettingsForm />)

    const setupButton = screen.getByText('Set Up')
    await userEvent.click(setupButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/6-digit code/)).toBeInTheDocument()
    })
  })

  it('shows verify and enable button after setup', async () => {
    renderWithProviders(<SecuritySettingsForm />)

    const setupButton = screen.getByText('Set Up')
    await userEvent.click(setupButton)

    await waitFor(() => {
      expect(screen.getByText('Verify & Enable')).toBeInTheDocument()
    })
  })

  it('shows disable form when Disable is clicked', async () => {
    mockSecuritySettings.mockReturnValue({
      data: { twoFactorEnabled: true, emailVerified: true, lastPasswordChange: null },
      isLoading: false,
    })

    renderWithProviders(<SecuritySettingsForm />)

    // First verify enabled state renders correctly
    expect(screen.getByText('Enabled')).toBeInTheDocument()
    
    const disableButton = screen.getByText('Disable')
    await userEvent.click(disableButton)

    // After clicking Disable, should show the disable confirmation form
    await waitFor(() => {
      expect(screen.getByText('Disable 2FA')).toBeInTheDocument()
      expect(screen.getByText(/enter your current password/i)).toBeInTheDocument()
    })
  })

  it('renders device icons for sessions', () => {
    renderWithProviders(<SecuritySettingsForm />)

    const laptopIcon = screen.getByTestId('icon-Laptop')
    expect(laptopIcon).toBeInTheDocument()
    // Smartphone icons appear in both the 2FA header and device icons
    const smartphoneIcons = screen.getAllByTestId('icon-Smartphone')
    expect(smartphoneIcons.length).toBeGreaterThanOrEqual(1)
  })
})