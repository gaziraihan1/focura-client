import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkspaceSwitcher } from '@/components/Dashboard/Storage/WorkspaceSwitcher';

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...filterProps(props)}>{props.children}</div>,
    button: (props: any) => <button {...filterProps(props)}>{props.children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: any) => <svg data-testid={name} {...props} />;
  return {
    Check: icon('check'),
    ChevronDown: icon('chevron-down'),
    Building2: icon('building2'),
    Crown: icon('crown'),
    Shield: icon('shield'),
    Users: icon('users'),
  };
});

vi.mock('@/hooks/useStorage', () => ({
  useWorkspacesSummary: vi.fn(() => ({
    data: [
      { workspaceId: 'ws-1', workspaceName: 'My Workspace', role: 'OWNER', usageMB: 50, totalMB: 100, percentage: 50 },
    ],
    isLoading: false,
  })),
}));

function filterProps(props: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(props)) {
    if (['children', 'initial', 'animate', 'exit', 'transition'].includes(k)) continue;
    if (k.startsWith('on') || k === 'className' || k === 'type' || k === 'style') out[k] = v;
  }
  return out;
}

describe('WorkspaceSwitcher', () => {
  const defaultProps = {
    currentWorkspaceId: 'ws-1',
    onWorkspaceChange: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders the current workspace name', () => {
    render(<WorkspaceSwitcher {...defaultProps} />);
    expect(screen.getByText('My Workspace')).toBeInTheDocument();
  });

  it('shows usage percentage', () => {
    render(<WorkspaceSwitcher {...defaultProps} />);
    expect(screen.getByText('50% used')).toBeInTheDocument();
  });
});
