'use client';

import { cn } from '@/lib/utils';

interface Column<T> {
  key:       string;
  header:    string;
  render:    (row: T) => React.ReactNode;
  className?: string;
}

interface Props<T> {
  columns:   Column<T>[];
  data:      T[];
  isLoading: boolean;
  skeletonRows?: number;
  /** Returns a stable, unique key for each row (e.g. row.id). Falls back to a
   *  content-based key so list identity survives reorders/filters. */
  getRowKey?: (row: T) => string | number;
}

function defaultRowKey<T>(row: T): string {
  try {
    return JSON.stringify(row);
  } catch {
    return crypto.randomUUID();
  }
}

export function AdminTable<T>({ columns, data, isLoading, skeletonRows = 8, getRowKey }: Props<T>) {
  const rowKey = getRowKey ?? defaultRowKey;
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap',
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading
              ? Array.from({ length: skeletonRows }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <div className="h-4 rounded bg-muted animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.map((row) => (
                  <tr key={rowKey(row)} className="hover:bg-muted/20 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-4 py-3', col.className)}>
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}