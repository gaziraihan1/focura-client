import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WorkspaceConfigurationModal } from '@/components/Settings/WorkspaceIntegrations/WorkspaceConfigurationModal';
import type { WorkspaceIntegration, WorkspaceMember } from '@/components/Settings/WorkspaceIntegrations/types';
import { api } from '@/lib/axios';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
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

// ─── Test Data ────────────────────────────────────────────────────────────────

const mockIntegration: WorkspaceIntegration = {
  id: 'int-1',
  name: 'GitHub',
  provider: 'github',
  active: true,
  config: { syncDirection: 'two-way', autoSync: true },
};

const mockMembers: WorkspaceMember[] = [
  { id: 'mem-1', userId: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'OWNER' },
  { id: 'mem-2', userId: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'MEMBER' },
];

const defaultProps = {
  integration: mockIntegration,
  members: mockMembers,
  onClose: vi.fn(),
  onSave: vi.fn(),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('WorkspaceConfigurationModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.put).mockResolvedValue({ success: true });
  });

  it('should render modal title', () => {
    render(<WorkspaceConfigurationModal {...defaultProps} />);

    expect(screen.getByText('Configure GitHub')).toBeInTheDocument();
  });

  it('should show sync direction options', () => {
    render(<WorkspaceConfigurationModal {...defaultProps} />);

    expect(screen.getByText('Sync Direction')).toBeInTheDocument();
    expect(screen.getByText('Focura → Provider')).toBeInTheDocument();
    expect(screen.getByText('Two-way')).toBeInTheDocument();
  });

  it('should show auto sync toggle', () => {
    render(<WorkspaceConfigurationModal {...defaultProps} />);

    expect(screen.getByText('Auto Sync')).toBeInTheDocument();
  });

  it('should show workspace notifications section', () => {
    render(<WorkspaceConfigurationModal {...defaultProps} />);

    expect(screen.getByText('Workspace Notifications')).toBeInTheDocument();
  });

  it('should show access control section', () => {
    render(<WorkspaceConfigurationModal {...defaultProps} />);

    expect(screen.getByText('Access Control')).toBeInTheDocument();
  });

  it('should show members list', () => {
    render(<WorkspaceConfigurationModal {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should show save button', () => {
    render(<WorkspaceConfigurationModal {...defaultProps} />);

    expect(screen.getByText('Save Configuration')).toBeInTheDocument();
  });

  it('should show cancel button', () => {
    render(<WorkspaceConfigurationModal {...defaultProps} />);

    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should call onClose when cancel is clicked', () => {
    const onClose = vi.fn();
    render(<WorkspaceConfigurationModal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should call API when save is clicked', async () => {
    render(<WorkspaceConfigurationModal {...defaultProps} />);

    fireEvent.click(screen.getByText('Save Configuration'));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        '/api/v1/workspace-integrations/int-1/config',
        expect.objectContaining({ config: expect.any(Object) }),
      );
    });
  });

  it('should call onSave when save succeeds', async () => {
    const onSave = vi.fn();
    render(<WorkspaceConfigurationModal {...defaultProps} onSave={onSave} />);

    fireEvent.click(screen.getByText('Save Configuration'));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });

  it('should select sync direction when clicked', () => {
    render(<WorkspaceConfigurationModal {...defaultProps} />);

    fireEvent.click(screen.getByText('Focura → Provider'));

    // The button should have primary styling
    expect(screen.getByText('Focura → Provider').className).toContain('bg-primary');
  });
});
