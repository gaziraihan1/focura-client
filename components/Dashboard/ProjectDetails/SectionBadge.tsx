'use client';

// Small presentational badge showing a section's color dot + name.
// Used on board cards, list rows and the task details page.

interface SectionBadgeProps {
  name: string;
  color?: string | null;
}

export function SectionBadge({ name, color }: SectionBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground w-fit">
      <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: color ?? '#667eea' }} />
      {name}
    </span>
  );
}
