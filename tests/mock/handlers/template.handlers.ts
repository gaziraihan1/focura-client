// tests/mock/handlers/template.handlers.ts
import { http, HttpResponse } from 'msw';
import type { TemplateCatalogItem } from '@/types/templates.types';
import { TEMPLATES } from '@/lib/templatesData';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const mockTemplateCatalogItem: TemplateCatalogItem = {
  id: 'tpl-eng-sprint',
  slug: 'engineering-sprint',
  title: 'Agile Sprint Board',
  description: '2-week sprint with backlog, in-progress, review, and done columns.',
  longDescription: 'A battle-tested sprint board for engineering teams.',
  category: 'engineering',
  complexity: 'starter',
  tier: 'PRO',
  icon: '⚙️',
  color: '#3b82f6',
  tags: ['agile', 'sprint'],
  usageCount: 42,
  estimatedSetupMinutes: 3,
  status: 'available',
  author: { name: 'Focura Team', role: 'Official' },
  content: {
    sections: [
      { name: 'Backlog', color: '#94a3b8', taskStatus: 'TODO', wipLimit: 20 },
      { name: 'In Progress', color: '#3b82f6', taskStatus: 'IN_PROGRESS', wipLimit: 3 },
      { name: 'Done', color: '#10b981', taskStatus: 'COMPLETED', wipLimit: null },
    ],
    labels: [
      { name: 'Feature', color: '#3b82f6' },
      { name: 'Bug', color: '#ef4444' },
    ],
    tasks: [
      { title: 'Sprint planning meeting', status: 'TODO', priority: 'HIGH', section: 'Backlog', label: 'Chore' },
      { title: 'User authentication flow', status: 'TODO', priority: 'URGENT', section: 'Backlog', label: 'Feature' },
    ],
    milestones: [{ title: 'Sprint End & Retro', dueWeek: 2 }],
    views: [{ name: 'Sprint Board', type: 'KANBAN' }],
  },
};

export const mockFreeTemplateCatalogItem: TemplateCatalogItem = {
  ...mockTemplateCatalogItem,
  id: 'tpl-quarterly-goals',
  slug: 'quarterly-goals',
  title: 'Quarterly Goals',
  description: 'Set and track personal quarterly goals with weekly check-ins.',
  longDescription: 'A personal OKR template for individuals.',
  category: 'personal',
  complexity: 'starter',
  tier: 'FREE',
  icon: '🎯',
  color: '#ec4899',
  tags: ['goals', 'okr'],
  usageCount: 128,
  estimatedSetupMinutes: 2,
  content: {
    sections: [
      { name: 'Objectives', color: '#ec4899', taskStatus: 'TODO' },
      { name: 'Completed', color: '#10b981', taskStatus: 'COMPLETED' },
    ],
    labels: [{ name: 'Planning', color: '#8b5cf6' }],
    tasks: [
      { title: 'Define 3 quarterly objectives', status: 'TODO', priority: 'HIGH', section: 'Objectives', label: 'Planning' },
    ],
    milestones: [{ title: 'Goals set', dueWeek: 1 }],
    views: [{ name: 'Goal Board', type: 'KANBAN' }],
  },
};

export const templateHandlers = [
  http.get(`${BASE}/api/v1/templates/catalog`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const tier = url.searchParams.get('tier');
    const search = url.searchParams.get('search')?.toLowerCase();

    let templates = [mockFreeTemplateCatalogItem, mockTemplateCatalogItem];
    if (category && category !== 'all') {
      templates = templates.filter((t) => t.category === category);
    }
    if (tier) {
      templates = templates.filter((t) => t.tier === tier);
    }
    if (search) {
      templates = templates.filter(
        (t) => t.title.toLowerCase().includes(search) || t.description.toLowerCase().includes(search),
      );
    }

    return HttpResponse.json({
      success: true,
      data: { templates, access: { tier: 'FREE' } },
    });
  }),

  http.get(`${BASE}/api/v1/templates/:slug`, ({ params }) => {
    const item = [mockFreeTemplateCatalogItem, mockTemplateCatalogItem].find(
      (t) => t.slug === params.slug,
    );
    if (!item) {
      return HttpResponse.json({ success: false, message: 'Template not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: item });
  }),

  http.post(`${BASE}/api/v1/templates/:slug/use`, async ({ request }) => {
    const body = (await request.json()) as { workspaceId?: string; projectName?: string };
    if (!body?.workspaceId) {
      return HttpResponse.json({ success: false, message: 'workspaceId is required' }, { status: 400 });
    }
    return HttpResponse.json(
      {
        success: true,
        message: 'Project created from template',
        data: {
          projectSlug: 'imported-project',
          workspaceSlug: body.workspaceId === 'ws-1' ? 'test-ws' : 'some-ws',
        },
      },
      { status: 201 },
    );
  }),

  http.post(`${BASE}/api/v1/templates/save-as-template/:projectId`, async () => {
    return HttpResponse.json(
      {
        success: true,
        message: 'Template saved',
        data: { slug: 'my-project-template', title: 'My Project' },
      },
      { status: 201 },
    );
  }),

  http.get(`${BASE}/api/v1/templates/private`, () => {
    return HttpResponse.json({
      success: true,
      data: [mockTemplateCatalogItem],
    });
  }),
];

// Re-export static catalog for test fixtures that want the full list.
export const TEMPLATES_FIXTURES = TEMPLATES;
