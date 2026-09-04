import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

beforeAll(() => {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error jsdom does not support IntersectionObserver
  globalThis.IntersectionObserver = MockIntersectionObserver;
});

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, alt = '', ...imgProps } = props;
    return <img alt={alt} {...imgProps} data-fill={fill} />;
  },
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`${name}-icon`} {...props} />;
    Component.displayName = name;
    return Component;
  };
  return {
    Clock: icon('Clock'),
    Layers: icon('Layers'),
    CheckCircle2: icon('CheckCircle2'),
    ChevronDown: icon('ChevronDown'),
    ChevronUp: icon('ChevronUp'),
    Crown: icon('Crown'),
    ArrowRight: icon('ArrowRight'),
    FolderPlus: icon('FolderPlus'),
    Star: icon('Star'),
    Sparkles: icon('Sparkles'),
  };
});

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}));

import TemplatesFeatured from '@/components/public/templates/TemplatesFeatured';
import type { Template } from '@/types/templates.types';

const base: Template = {
  id: 't1',
  slug: 'featured-one',
  title: 'Featured One',
  description: 'A featured template',
  longDescription: '',
  category: 'engineering',
  complexity: 'starter',
  status: 'available',
  tier: 'PRO',
  icon: '⚙️',
  color: '#3b82f6',
  tasks: [],
  labels: [],
  sections: [],
  milestones: [],
  views: [],
  usageCount: 100,
  rating: { average: 4.9, count: 50 },
  featured: true,
  estimatedSetupMinutes: 3,
  tags: [],
  author: { name: 'Gablura Team', role: 'Official' },
};

describe('TemplatesFeatured', () => {
  it('renders the strip with the featured templates', () => {
    render(
      <TemplatesFeatured
        templates={[base, { ...base, id: 't2', title: 'Featured Two' }]}
        accessTier='PRO'
        onUse={vi.fn()}
        onUpgrade={vi.fn()}
      />,
    );
    expect(screen.getByText('Featured templates')).toBeInTheDocument();
    expect(screen.getByText('Featured One')).toBeInTheDocument();
    expect(screen.getByText('Featured Two')).toBeInTheDocument();
  });

  it('hides entirely when there are no featured templates', () => {
    render(
      <TemplatesFeatured
        templates={[]}
        accessTier='PRO'
        onUse={vi.fn()}
        onUpgrade={vi.fn()}
      />,
    );
    expect(screen.queryByText('Featured templates')).not.toBeInTheDocument();
  });
});
