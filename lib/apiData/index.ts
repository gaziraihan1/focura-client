// ─────────────────────────────────────────────────────────────────────────────
// Gablura API — Barrel export
// ─────────────────────────────────────────────────────────────────────────────

export * from './types';
import type { ApiSection, Endpoint } from './types';

import { authSection } from './sections/auth';
import { workspacesSection } from './sections/workspaces';
import { projectsSection } from './sections/projects';
import { tasksSection } from './sections/tasks';
import { commentsSection } from './sections/comments';
import { focusSection } from './sections/focus';
import { notificationsSection } from './sections/notifications';
import { filesSection } from './sections/files';
import { contactSection } from './sections/contact';
import { jobsSection } from './sections/jobs';
import { automationsSection } from './sections/automations';
import { templatesSection } from './sections/templates';

export const API_SECTIONS: ApiSection[] = [
  authSection,
  workspacesSection,
  projectsSection,
  tasksSection,
  commentsSection,
  focusSection,
  notificationsSection,
  filesSection,
  contactSection,
  jobsSection,
  automationsSection,
  templatesSection,
];

// ─── Flat list helper for search ──────────────────────────────────────────────
export const ALL_ENDPOINTS: Endpoint[] = API_SECTIONS.flatMap((s) => s.endpoints);

export function findEndpoint(id: string): Endpoint | undefined {
  return ALL_ENDPOINTS.find((e) => e.id === id);
}

export function findSection(id: string): ApiSection | undefined {
  return API_SECTIONS.find((s) => s.id === id);
}
