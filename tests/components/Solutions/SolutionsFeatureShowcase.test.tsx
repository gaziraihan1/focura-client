import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// ─── Mocks ─────────────────────────────────────────────────────────────────

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
      <div {...filterDomProps(props)}>{children}</div>
    ),
  },
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid={`${name}-icon`} {...props} />
    );
    Component.displayName = name;
    return Component;
  };
  return {
    Calendar: icon('Calendar'),
    CheckCircle2: icon('CheckCircle2'),
    Clock: icon('Clock'),
    FolderOpen: icon('FolderOpen'),
    HeartPulse: icon('HeartPulse'),
    LayoutDashboard: icon('LayoutDashboard'),
    ListChecks: icon('ListChecks'),
    MessageSquare: icon('MessageSquare'),
    MoreHorizontal: icon('MoreHorizontal'),
    Plus: icon('Plus'),
    Search: icon('Search'),
    Settings: icon('Settings'),
    Zap: icon('Zap'),
  };
});

function filterDomProps(props: Record<string, unknown>) {
  const domProps: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (
      !key.startsWith('initial') &&
      !key.startsWith('animate') &&
      !key.startsWith('while') &&
      !key.startsWith('exit') &&
      !key.startsWith('transition') &&
      !key.startsWith('viewport') &&
      !key.startsWith('layout')
    ) {
      domProps[key] = props[key];
    }
  }
  return domProps;
}

import SolutionsFeatureShowcase from '@/components/Solutions/SolutionsFeatureShowcase';
import { ThreadMock } from '@/components/Solutions/SolutionMocks';

describe('SolutionsFeatureShowcase', () => {
  it('renders the section heading', () => {
    render(<SolutionsFeatureShowcase />);
    expect(
      screen.getByText('Powerful Features That Fit Your Workflow')
    ).toBeInTheDocument();
  });

  it('renders all three feature cards', () => {
    render(<SolutionsFeatureShowcase />);
    expect(screen.getByText('Automated Task Routing')).toBeInTheDocument();
    expect(screen.getByText('Custom Workflows for Every Team')).toBeInTheDocument();
    expect(screen.getByText('Collaboration Without Chaos')).toBeInTheDocument();
  });

  it('renders the collaboration thread conversation', () => {
    render(<SolutionsFeatureShowcase />);
    expect(
      screen.getByText(/Shipped the new dashboard today/)
    ).toBeInTheDocument();
  });

  it('hides the thread sidebar inside the narrow feature card', () => {
    render(<SolutionsFeatureShowcase />);
    // The compact (showSidebar=false) mock must not render the sidebar panels
    expect(screen.queryByText('Assignees')).not.toBeInTheDocument();
    expect(screen.queryByText('Details')).not.toBeInTheDocument();
  });
});

describe('ThreadMock', () => {
  it('shows the sidebar by default', () => {
    render(<ThreadMock />);
    expect(screen.getByText('Assignees')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('hides the sidebar when showSidebar is false', () => {
    render(<ThreadMock showSidebar={false} />);
    expect(screen.queryByText('Assignees')).not.toBeInTheDocument();
    expect(screen.queryByText('Details')).not.toBeInTheDocument();
    expect(screen.getByText(/Shipped the new dashboard today/)).toBeInTheDocument();
  });
});
