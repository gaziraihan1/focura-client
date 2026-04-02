'use client';

import { Search } from 'lucide-react';

interface Props {
  icon:       React.ReactNode;
  title:      string;
  count?:     number;
  search?:    string;
  onSearch?:  (v: string) => void;
  placeholder?: string;
  actions?:   React.ReactNode;
}

export function AdminPageHeader({
  icon, title, count, search, onSearch, placeholder, actions,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2.5">
        {icon}
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {count !== undefined && (
          <span className="text-sm text-muted-foreground">({count.toLocaleString()})</span>
        )}
      </div>
      <div className="flex w-full sm:w-auto items-center gap-3">
        {onSearch && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={placeholder ?? 'Search…'}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border bg-card focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        )}
        {actions}
      </div>
    </div>
  );
}