// ─────────────────────────────────────────────────────────────────────────────
// Focura Templates — Data Types
// ─────────────────────────────────────────────────────────────────────────────

export type TemplateCategory =
  | 'engineering'
  | 'product'
  | 'marketing'
  | 'design'
  | 'operations'
  | 'hr'
  | 'startup'
  | 'personal';

export type TemplateComplexity = 'starter' | 'intermediate' | 'advanced';
export type TemplateStatus     = 'coming_soon' | 'available';

/** Plan tier required to use a template. FREE < PRO < BUSINESS. */
export type TemplateTier = 'FREE' | 'PRO' | 'BUSINESS';

/** Access tier of the current user, resolved from their owned workspaces. */
export type TemplateAccessTier = TemplateTier;

export interface TemplateTask {
  title      : string;
  status     : 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority   : 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  label     ?: string;
  section   ?: string;
}

export interface TemplateLabel {
  name  : string;
  color : string;
}

export interface TemplateMilestone {
  title  : string;
  dueWeek: number; // weeks from project start
}

export interface Template {
  id          : string;
  slug        : string;
  title       : string;
  description : string;
  longDescription: string;
  category    : TemplateCategory;
  complexity  : TemplateComplexity;
  status      : TemplateStatus;
  tier        : TemplateTier;   // plan tier required to use this template
  icon        : string;         // emoji
  color       : string;         // hex accent
  tasks       : TemplateTask[];
  labels      : TemplateLabel[];
  sections    : string[];
  milestones  : TemplateMilestone[];
  views       : string[];       // which views to set up
  usageCount  : number;
  rating      : { average: number; count: number };
  featured    : boolean;
  estimatedSetupMinutes: number;
  tags        : string[];
  previewImage?: string;
  author      : { name: string; role: string };
}

// ─── Backend catalog API ──────────────────────────────────────────────────────

/** Content snapshot of a template as stored by the backend. */
export interface TemplateContent {
  sections: Array<{
    name: string;
    description?: string | null;
    color?: string | null;
    taskStatus?: string | null;
    wipLimit?: number | null;
  }>;
  labels: TemplateLabel[];
  tasks: TemplateTask[];
  milestones: TemplateMilestone[];
  views: Array<{ name: string; type: string }>;
}

/** Single item returned by GET /api/v1/templates/catalog. */
export interface TemplateCatalogItem {
  id          : string;
  slug        : string;
  title       : string;
  description : string;
  longDescription: string | null;
  category    : string;
  complexity  : string;
  tier        : TemplateTier;
  icon        : string | null;
  color       : string | null;
  tags        : unknown;
  usageCount  : number;
  rating      : { average: number; count: number };
  featured    : boolean;
  estimatedSetupMinutes: number;
  status      : string;
  author      : { name: string; role: string } | null;
  content     : TemplateContent;
}

/** Response data for POST /api/v1/templates/:slug/rate. */
export interface TemplateRateResult {
  average: number;
  count  : number;
}

export interface TemplateCatalogResponse {
  templates: TemplateCatalogItem[];
  access   : { tier: TemplateAccessTier };
}

/** Body for POST /api/v1/templates/:slug/use. */
export interface TemplateImportInput {
  workspaceId: string;
  projectName?: string;
}

/** Response data for POST /api/v1/templates/:slug/use. */
export interface TemplateImportResult {
  projectSlug  : string;
  workspaceSlug: string;
}

/** Body for POST /api/v1/templates/save-as-template/:projectId. */
export interface SaveAsTemplateInput {
  title?     : string;
  visibility?: 'PRIVATE' | 'PUBLIC';
}

export interface SaveAsTemplateResult {
  slug : string;
  title: string;
}

// ─── Tier metadata ────────────────────────────────────────────────────────────

export const TIER_META: Record<TemplateTier, {
  label       : string;
  description : string;
  badgeStyle  : string;
  lockedStyle : string;
  dot         : string;
}> = {
  FREE: {
    label      : 'Free',
    description: 'Included with every plan — start instantly.',
    badgeStyle : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50',
    lockedStyle: 'text-emerald-600 dark:text-emerald-400',
    dot        : 'bg-emerald-500',
  },
  PRO: {
    label      : 'Pro',
    description: 'Unlock with the Pro plan or higher.',
    badgeStyle : 'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50',
    lockedStyle: 'text-violet-600 dark:text-violet-400',
    dot        : 'bg-violet-500',
  },
  BUSINESS: {
    label      : 'Business',
    description: 'Available on Business and Enterprise plans.',
    badgeStyle : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50',
    lockedStyle: 'text-amber-600 dark:text-amber-400',
    dot        : 'bg-amber-500',
  },
};

/** Rank map used for tier gating (FREE < PRO < BUSINESS). */
export const TIER_RANK: Record<TemplateTier, number> = {
  FREE    : 0,
  PRO     : 1,
  BUSINESS: 2,
};

/** True when the user's access tier is high enough for the template tier. */
export function canAccessTemplate(accessTier: TemplateAccessTier, tier: TemplateTier): boolean {
  return TIER_RANK[accessTier] >= TIER_RANK[tier];
}

/** Human-friendly tier requirement for upgrade CTAs. */
export function tierRequirement(tier: TemplateTier): string {
  if (tier === 'FREE') return 'Included free';
  if (tier === 'PRO') return 'Requires Pro';
  return 'Requires Business';
}
