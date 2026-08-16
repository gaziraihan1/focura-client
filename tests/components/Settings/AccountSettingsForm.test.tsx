import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { ProfileFormFields } from '@/components/Dashboard/Profile/ProfileFormFields';
import { ProfilePageHeader } from '@/components/Dashboard/Profile/ProfilePageHeader';
import { useProfilePage } from '@/hooks/useProfilePage';
import { api } from '@/lib/axios';

// The former AccountSettingsForm was refactored into the Profile page
// (components/Dashboard/Profile/* + hooks/useProfilePage). These tests cover
// the form fields, the save header, and the fetch/save flow of that refactor.

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    upload: vi.fn(),
  },
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('lucide-react', () => ({
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x-icon" {...props} />,
  Save: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="save-icon" {...props} />,
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="loader-icon" {...props} />,
  Mail: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="mail-icon" {...props} />,
}));

// ─── Test Setup ───────────────────────────────────────────────────────────────

const mockProfile = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  bio: 'Test bio',
  timezone: 'UTC',
  image: null,
};

const mockProfileResponse = {
  data: {
    user: mockProfile,
    storage: { total: 10240, used: 5120, remaining: 5120 },
  },
};

// Harness that renders the state exposed by useProfilePage so the fetch/save
// flow can be exercised without the full page tree.
function ProfileFlowHarness() {
  const { profile, formData, saving, handleSave } = useProfilePage();

  return (
    <div>
      <input aria-label="name" value={formData.name} readOnly />
      <span data-testid="email">{profile?.email}</span>
      <span data-testid="bio">{formData.bio}</span>
      <span data-testid="timezone">{formData.timezone}</span>
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ProfileFormFields (account settings form fields)', () => {
  const defaultProps = {
    isEditing: true,
    formData: { name: 'John Doe', bio: 'Test bio', timezone: 'UTC' },
    email: 'john@example.com',
    onFormChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<ProfileFormFields {...defaultProps} />);

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
    expect(screen.getByLabelText('Timezone')).toBeInTheDocument();
  });

  it('populates name field', () => {
    render(<ProfileFormFields {...defaultProps} />);
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  it('populates email field', () => {
    render(<ProfileFormFields {...defaultProps} />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('populates bio field', () => {
    render(<ProfileFormFields {...defaultProps} />);
    expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument();
  });

  it('populates timezone field', () => {
    render(<ProfileFormFields {...defaultProps} />);
    expect(screen.getByDisplayValue('UTC')).toBeInTheDocument();
  });

  it('has an interactive name input', () => {
    render(<ProfileFormFields {...defaultProps} />);

    const nameInput = screen.getByLabelText('Full Name') as HTMLInputElement;
    expect(nameInput).not.toBeDisabled();
    expect(nameInput.type).toBe('text');
  });
});

describe('ProfilePageHeader (save button)', () => {
  const defaultProps = {
    isEditing: true,
    isSaving: false,
    onEdit: vi.fn(),
    onCancel: vi.fn(),
    onSave: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows save button', () => {
    render(<ProfilePageHeader {...defaultProps} />);
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('calls onSave when save is clicked', () => {
    render(<ProfilePageHeader {...defaultProps} />);
    fireEvent.click(screen.getByText('Save Changes'));
    expect(defaultProps.onSave).toHaveBeenCalled();
  });

  it('disables save button while saving', () => {
    render(<ProfilePageHeader {...defaultProps} isSaving={true} />);
    const saveBtn = screen.getByText('Save Changes').closest('button');
    expect(saveBtn).toBeDisabled();
  });
});

describe('useProfilePage (account settings fetch/save flow)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockResolvedValue(mockProfileResponse);
    vi.mocked(api.put).mockResolvedValue({ data: { user: mockProfile } });
  });

  it('loads and populates the profile after fetch', async () => {
    render(<ProfileFlowHarness />);

    await waitFor(() => {
      expect(screen.getByLabelText('name')).toHaveValue('John Doe');
    });
    expect(screen.getByTestId('email')).toHaveTextContent('john@example.com');
    expect(screen.getByTestId('bio')).toHaveTextContent('Test bio');
    expect(screen.getByTestId('timezone')).toHaveTextContent('UTC');
  });

  it('calls API when save is clicked', async () => {
    render(<ProfileFlowHarness />);

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/api/v1/user/profile', expect.objectContaining({
        name: 'John Doe',
        bio: 'Test bio',
        timezone: 'UTC',
      }));
    });
  });

  it('shows success toast after save', async () => {
    const toast = (await import('react-hot-toast')).default;
    render(<ProfileFlowHarness />);

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully');
    });
  });

  it('shows saving state while save is pending', async () => {
    vi.mocked(api.put).mockImplementation(() => new Promise(() => {}));

    render(<ProfileFlowHarness />);

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
    expect(screen.getByText('Saving...').closest('button')).toBeDisabled();
  });
});