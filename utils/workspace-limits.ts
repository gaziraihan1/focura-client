// Shared rendering helpers for Gablura-admin workspace-limit changes
// (metadata: { source: 'gablura-admin', changes: { field: { from, to } } }).
// Used by both the admin activity feed and the user-facing workspace feed.

export const WORKSPACE_LIMIT_LABELS: Record<string, string> = {
  plan:              'Plan',
  maxMembers:        'Max members',
  maxStorage:        'Max storage',
  aiDailyCalls:      'AI calls / day',
  aiMonthlyTokens:   'AI tokens / month',
  aiMaxOutputTokens: 'AI max output / response',
};

export function formatWorkspaceLimitValue(field: string, value: unknown): string {
  if (value === null || value === undefined) return 'default';
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  if (field === 'aiMonthlyTokens') {
    return n >= 1_000_000
      ? `${(n / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`
      : n.toLocaleString();
  }
  return n.toLocaleString();
}

/** True when the activity metadata marks a Gablura-admin audit row. */
export function isGabluraAdminChange(source: unknown): boolean {
  return source === 'gablura-admin';
}

export type WorkspaceLimitChange = { from: unknown; to: unknown };

export interface WorkspaceLimitPart {
  field: string;
  label: string;
  from: string;
  to: string;
}

/**
 * Shape-guarded friendly before → after parts for each changed limit field.
 * Returns [] for non-object, empty, or malformed changes.
 */
export function getWorkspaceLimitParts(changes: unknown): WorkspaceLimitPart[] {
  if (!changes || typeof changes !== 'object') return [];
  return Object.entries(changes)
    .filter(
      ([, change]) =>
        typeof change === 'object' && change !== null && 'from' in change && 'to' in change,
    )
    .map(([field, change]) => {
      const c = change as WorkspaceLimitChange;
      return {
        field,
        label: WORKSPACE_LIMIT_LABELS[field] ?? field,
        from:  formatWorkspaceLimitValue(field, c.from),
        to:    formatWorkspaceLimitValue(field, c.to),
      };
    });
}
