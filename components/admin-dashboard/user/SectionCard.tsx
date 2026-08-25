// components/AdminUserDetail/SectionCard.tsx
import type { SectionCardProps } from '@/types/admin.types';

export function SectionCard({ title, children, count }: SectionCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {count !== undefined && (
          <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <div className="divide-y divide-border/50 max-h-72 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}