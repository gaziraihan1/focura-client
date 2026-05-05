// ─────────────────────────────────────────────────────────────────────────────
// Focura Templates — Data Types & Mock Registry
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
  icon        : string;        // emoji
  color       : string;        // hex accent
  tasks       : TemplateTask[];
  labels      : TemplateLabel[];
  sections    : string[];
  milestones  : TemplateMilestone[];
  views       : string[];      // which views to set up
  usageCount  : number;
  estimatedSetupMinutes: number;
  tags        : string[];
  previewImage?: string;
  author      : { name: string; role: string };
}