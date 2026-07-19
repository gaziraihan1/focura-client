import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LabelManagementMain from '@/components/Dashboard/Labels/LabelManagementMain';

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('@/hooks/useLabelPage', () => ({
  useLabelPage: () => ({
    router: { push: vi.fn() },
    searchQuery: '',
    setSearchQuery: vi.fn(),
    setPage: vi.fn(),
    isCreateModalOpen: false,
    setIsCreateModalOpen: vi.fn(),
    editingLabel: null,
    setEditingLabel: vi.fn(),
    deletingLabel: null,
    setDeletingLabel: vi.fn(),
    activeDropdown: null,
    setActiveDropdown: vi.fn(),
    isRoleLoading: false,
    filteredLabels: [
      {
        id: '1',
        name: 'Bug',
        color: '#ef4444',
        description: 'Bug label',
        createdAt: new Date().toISOString(),
        _count: { tasks: 3 },
        workspace: { slug: 'test-workspace' },
      },
    ],
    isLoading: false,
    canManageLabels: true,
    pagination: null,
  }),
}));

vi.mock('@/components/Dashboard/Labels/LabelCard', () => ({
  default: ({ label }: any) => <div data-testid="label-card">{label.name}</div>,
}));

vi.mock('@/components/Dashboard/Labels/LabelFormModal', () => ({
  default: () => <div data-testid="label-form-modal" />,
}));

vi.mock('@/components/Dashboard/Labels/DeleteConfirmModal', () => ({
  default: () => <div data-testid="delete-confirm-modal" />,
}));

vi.mock('@/components/Dashboard/Labels/LabelManagementMain/LabelManagementHeader', () => ({
  LabelManagementHeader: () => <div data-testid="label-management-header" />,
}));

vi.mock('@/components/Dashboard/Labels/LabelManagementMain/LabelsEmptyState', () => ({
  LabelsEmptyState: () => <div data-testid="labels-empty-state" />,
}));

vi.mock('@/components/Dashboard/Labels/LabelManagementSkeleton', () => ({
  LabelManagementSkeleton: () => <div data-testid="label-management-skeleton" />,
  LabelGridSkeleton: () => <div data-testid="label-grid-skeleton" />,
}));

vi.mock('@/components/Dashboard/Labels/LabelDetails/PaginationControls', () => ({
  PaginationControls: () => <div data-testid="pagination-controls" />,
}));

describe('LabelManagementMain', () => {
  it('renders the management header', () => {
    render(<LabelManagementMain workspaceId="w1" workspaceSlug="test" />);
    expect(screen.getByTestId('label-management-header')).toBeInTheDocument();
  });

  it('renders label cards', () => {
    render(<LabelManagementMain workspaceId="w1" workspaceSlug="test" />);
    expect(screen.getByText('Bug')).toBeInTheDocument();
  });

  it('does not show skeleton when loaded', () => {
    render(<LabelManagementMain workspaceId="w1" workspaceSlug="test" />);
    expect(screen.queryByTestId('label-management-skeleton')).not.toBeInTheDocument();
  });
});
