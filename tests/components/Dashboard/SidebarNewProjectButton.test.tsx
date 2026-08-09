import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SidebarNewProjectButton from '@/components/Dashboard/SidebarNewProjectButton';

// ─── Shared mocks (vi.hoisted so the factories can read them) ────────────────
const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  mutateAsync: vi.fn().mockResolvedValue({ projectSlug: 'p1', workspaceSlug: 'ws-1' }),
  workspaces: [] as unknown[],
  catalog: { data: undefined as unknown, isLoading: false },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('@/hooks/useWorkspaceQueries', () => ({
  useWorkspaces: () => ({ data: mocks.workspaces, isLoading: false }),
}));

vi.mock('@/hooks/useTemplates', () => ({
  useTemplateCatalog: () => ({
    data: mocks.catalog.data,
    isLoading: mocks.catalog.isLoading,
  }),
  useTemplateImport: () => ({ mutateAsync: mocks.mutateAsync, isPending: false }),
}));

vi.mock('@/lib/templatesData', () => ({
  catalogItemToTemplate: (item: {
    id: string;
    slug: string;
    title: string;
    description?: string;
    category?: string;
    status?: string;
    tier: string;
    icon?: string;
    color?: string;
    estimatedSetupMinutes?: number;
    content?: { tasks?: unknown[]; labels?: unknown[]; sections?: Array<{ name: string }>; milestones?: unknown[]; views?: Array<{ type: string }> };
  }) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description ?? '',
    longDescription: '',
    category: item.category ?? 'engineering',
    complexity: 'starter' as const,
    status: item.status ?? 'available',
    tier: item.tier as 'FREE' | 'PRO' | 'BUSINESS',
    icon: item.icon ?? '📁',
    color: item.color ?? '#667eea',
    tasks: item.content?.tasks ?? [],
    labels: item.content?.labels ?? [],
    sections: item.content?.sections?.map((s) => s.name) ?? [],
    milestones: item.content?.milestones ?? [],
    views: item.content?.views?.map((v) => v.type) ?? [],
    usageCount: 0,
    estimatedSetupMinutes: item.estimatedSetupMinutes ?? 5,
    tags: [],
    author: { name: 'Focura', role: 'Official' },
  }),
  TEMPLATES: [],
}));

vi.mock('@/components/Templates/TemplateTierBadge', () => ({
  default: ({ tier, locked }: { tier: string; locked?: boolean }) => (
    <span data-testid={`tier-badge-${tier}`} data-locked={locked ? 'true' : 'false'}>
      {locked ? `Locked ${tier}` : tier}
    </span>
  ),
}));

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />;
    C.displayName = name;
    return C;
  };
  return {
    ArrowRight: icon('ArrowRight'),
    FolderPlus: icon('FolderPlus'),
    Layers: icon('Layers'),
    Loader2: icon('Loader2'),
    Lock: icon('Lock'),
    Plus: icon('Plus'),
    X: icon('X'),
  };
});

// ─── Fixtures ────────────────────────────────────────────────────────────────
const workspace = {
  id: 'ws-1',
  slug: 'ws-1',
  name: 'My Workspace',
  plan: 'FREE',
  isPublic: false,
  allowInvites: true,
  maxMembers: 5,
  maxStorage: 1024,
  ownerId: 'u1',
  owner: { id: 'u1', name: 'Owner', email: 'o@x.com' },
  members: [],
  _count: { projects: 0, members: 1 },
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const freeTemplate = {
  id: 'tpl-free',
  slug: 'personal-goals',
  title: 'Personal Goals',
  description: 'Track goals',
  status: 'available',
  tier: 'FREE',
  content: { tasks: [{ title: 'T1' }, { title: 'T2' }], sections: [{ name: 'Todo' }], labels: [], milestones: [], views: [{ type: 'KANBAN' }] },
  estimatedSetupMinutes: 5,
};

const businessTemplate = {
  id: 'tpl-biz',
  slug: 'enterprise-launch',
  title: 'Enterprise Launch',
  description: 'Full launch',
  status: 'available',
  tier: 'BUSINESS',
  content: { tasks: [{ title: 'T1' }], sections: [{ name: 'Backlog' }], labels: [], milestones: [], views: [{ type: 'KANBAN' }] },
  estimatedSetupMinutes: 8,
};

describe('SidebarNewProjectButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.workspaces = [workspace];
    mocks.catalog.data = undefined;
    mocks.catalog.isLoading = false;
  });

  it('renders the New project button', () => {
    render(<SidebarNewProjectButton />);
    expect(screen.getByText('New project')).toBeInTheDocument();
  });

  it('opens the quick-picker modal on click', () => {
    mocks.catalog.data = { templates: [freeTemplate] };
    render(<SidebarNewProjectButton />);
    fireEvent.click(screen.getByText('New project'));

    expect(screen.getByRole('dialog', { name: 'New project' })).toBeInTheDocument();
    expect(screen.getByText('Personal Goals')).toBeInTheDocument();
    expect(screen.getByDisplayValue('My Workspace')).toBeInTheDocument();
  });

  it('closes the modal via the close button', () => {
    mocks.catalog.data = { templates: [freeTemplate] };
    render(<SidebarNewProjectButton />);
    fireEvent.click(screen.getByText('New project'));
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the modal when Escape is pressed', () => {
    mocks.catalog.data = { templates: [freeTemplate] };
    render(<SidebarNewProjectButton />);
    fireEvent.click(screen.getByText('New project'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows locked templates with an upgrade CTA to the selected workspace billing page', () => {
    mocks.catalog.data = { templates: [freeTemplate, businessTemplate] };
    render(<SidebarNewProjectButton />);
    fireEvent.click(screen.getByText('New project'));

    expect(screen.getByTestId('tier-badge-BUSINESS')).toHaveAttribute('data-locked', 'true');
    fireEvent.click(screen.getByText('Unlock'));
    expect(mocks.push).toHaveBeenCalledWith('/dashboard/workspaces/ws-1/billing/upgrade');
  });

  it('imports an unlocked template into the selected workspace and deep-links', async () => {
    mocks.catalog.data = { templates: [freeTemplate, businessTemplate] };
    render(<SidebarNewProjectButton />);
    fireEvent.click(screen.getByText('New project'));

    fireEvent.click(screen.getByText('Use template'));
    expect(mocks.mutateAsync).toHaveBeenCalledWith({
      slug: 'personal-goals',
      workspaceId: 'ws-1',
    });
    await vi.waitFor(() =>
      expect(mocks.push).toHaveBeenCalledWith('/dashboard/workspaces/ws-1/projects/p1'),
    );
  });

  it('navigates to the blank New Project page via Start blank', () => {
    mocks.catalog.data = { templates: [freeTemplate] };
    render(<SidebarNewProjectButton />);
    fireEvent.click(screen.getByText('New project'));

    fireEvent.click(screen.getByText('Start blank'));
    expect(mocks.push).toHaveBeenCalledWith('/dashboard/workspaces/ws-1/projects/new-project');
  });
});
