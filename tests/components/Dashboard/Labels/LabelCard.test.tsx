import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LabelCard from '@/components/Dashboard/Labels/LabelCard';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('@/components/Shared/PermissionModal', () => ({
  PermissionModal: () => <div data-testid="permission-modal" />,
}));

const mockLabel = {
  id: '1',
  name: 'Bug',
  color: '#ef4444',
  description: 'Bug fix label',
  createdAt: new Date().toISOString(),
  _count: { tasks: 5 },
  workspace: { slug: 'test-workspace' },
} as any;

const defaultProps = {
  label: mockLabel,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  isDropdownActive: false,
  onDropdownToggle: vi.fn(),
  canManageLabels: true,
};

describe('LabelCard', () => {
  it('renders the label name', () => {
    render(<LabelCard {...defaultProps} />);
    expect(screen.getByText('Bug')).toBeInTheDocument();
  });

  it('renders the task count', () => {
    render(<LabelCard {...defaultProps} />);
    expect(screen.getByText('5 tasks')).toBeInTheDocument();
  });

  it('renders the label description', () => {
    render(<LabelCard {...defaultProps} />);
    expect(screen.getByText('Bug fix label')).toBeInTheDocument();
  });
});
