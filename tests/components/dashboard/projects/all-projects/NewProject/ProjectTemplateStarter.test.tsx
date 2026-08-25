import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectTemplateStarter from '@/components/dashboard/projects/all-projects/NewProject/ProjectTemplateStarter';

// ─── Shared mocks (vi.hoisted so the factories can read them) ────────────────
const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  mutateAsync: vi.fn().mockResolvedValue({ projectSlug: 'p1', workspaceSlug: 'ws-1' }),
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

vi.mock('@/components/public/templates/TemplateTierBadge', () => ({
  default: ({ tier, locked }: { tier: string; locked?: boolean }) => (
    <span data-testid={`tier-badge-${tier}`} data-locked={locked ? 'true' : 'false'}>
      {locked ? `Locked ${tier}` : tier}
    </span>
  ),
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />;
    C.displayName = name;
    return C;
  };
  return { ArrowRight: icon('ArrowRight'), FolderPlus: icon('FolderPlus'), Layers: icon('Layers'), Loader2: icon('Loader2'), Lock: icon('Lock') };
});

// ─── Fixtures ────────────────────────────────────────────────────────────────
const freeTemplate = {
  id: 'tpl-free',
  slug: 'personal-goals',
  title: 'Personal Goals',
  description: 'Track goals',
  status: 'available',
  tier: 'FREE',
  content: {
    tasks: [{ title: 'T1' }, { title: 'T2' }],
    sections: [{ name: 'Todo' }],
    labels: [],
    milestones: [],
    views: [{ type: 'KANBAN' }],
  },
  estimatedSetupMinutes: 5,
};

const businessTemplate = {
  id: 'tpl-biz',
  slug: 'enterprise-launch',
  title: 'Enterprise Launch',
  description: 'Full launch',
  status: 'available',
  tier: 'BUSINESS',
  content: {
    tasks: [{ title: 'T1' }],
    sections: [{ name: 'Backlog' }],
    labels: [],
    milestones: [],
    views: [{ type: 'KANBAN' }],
  },
  estimatedSetupMinutes: 8,
};

const comingSoonTemplate = {
  id: 'tpl-soon',
  slug: 'next-big-thing',
  title: 'Next Big Thing',
  description: 'Coming later',
  status: 'coming_soon',
  tier: 'PRO',
  content: { tasks: [], sections: [], labels: [], milestones: [], views: [] },
  estimatedSetupMinutes: 3,
};

const defaultProps = { workspaceId: 'ws-1', workspaceSlug: 'ws-1', plan: 'FREE' as const };

describe('ProjectTemplateStarter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.catalog.data = undefined;
    mocks.catalog.isLoading = false;
  });

  it('renders the section with available templates from the catalog', () => {
    mocks.catalog.data = { templates: [freeTemplate, businessTemplate] };
    render(<ProjectTemplateStarter {...defaultProps} />);

    expect(screen.getByText('Start from a template')).toBeInTheDocument();
    expect(screen.getByText('Personal Goals')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Launch')).toBeInTheDocument();
  });

  it('hides the section while the catalog is loading', () => {
    mocks.catalog.isLoading = true;
    render(<ProjectTemplateStarter {...defaultProps} />);
    expect(screen.queryByText('Start from a template')).not.toBeInTheDocument();
  });

  it('hides the section when there are no available templates', () => {
    mocks.catalog.data = { templates: [comingSoonTemplate] };
    render(<ProjectTemplateStarter {...defaultProps} />);
    expect(screen.queryByText('Start from a template')).not.toBeInTheDocument();
  });

  it('shows locked templates with an upgrade CTA to the billing upgrade page', () => {
    mocks.catalog.data = { templates: [freeTemplate, businessTemplate] };
    render(<ProjectTemplateStarter {...defaultProps} />); // FREE plan

    expect(screen.getByTestId('tier-badge-BUSINESS')).toHaveAttribute('data-locked', 'true');
    fireEvent.click(screen.getByText('Unlock'));
    expect(mocks.push).toHaveBeenCalledWith('/dashboard/workspaces/ws-1/billing/upgrade');
  });

  it('imports an unlocked template and deep-links to the created project', async () => {
    mocks.catalog.data = { templates: [freeTemplate, businessTemplate] };
    render(<ProjectTemplateStarter {...defaultProps} />);

    fireEvent.click(screen.getByText('Use template'));

    expect(mocks.mutateAsync).toHaveBeenCalledWith({
      slug: 'personal-goals',
      workspaceId: 'ws-1',
    });
    // await the resolved promise + router push
    await vi.waitFor(() =>
      expect(mocks.push).toHaveBeenCalledWith('/dashboard/workspaces/ws-1/projects/p1'),
    );
  });

  it('links out to the full templates page', () => {
    mocks.catalog.data = { templates: [freeTemplate] };
    render(<ProjectTemplateStarter {...defaultProps} />);

    expect(screen.getByText('Browse all templates').closest('a')).toHaveAttribute('href', '/templates');
  });
});
