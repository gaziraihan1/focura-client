// components/Analytics/WorkspaceUsage/WorkspaceUsageHeader.tsx
"use client";

import { Download, RefreshCw, BarChart3 } from "lucide-react";
import type { DateRangeFilter } from "@/types/workspace-usage.types";

interface WorkspaceUsageHeaderProps {
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
  onExport: () => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

const DATE_RANGES: Array<{ value: DateRangeFilter; label: string }> = [
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
  { value: "custom", label: "Custom" },
];

export function WorkspaceUsageHeader({
  dateRange,
  onDateRangeChange,
  onExport,
  isRefreshing = false,
  onRefresh,
}: WorkspaceUsageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-5 sm:pb-6 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">
            Workspace Usage
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Engagement & resource consumption overview
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center p-1 rounded-lg bg-muted border border-border gap-0.5">
          {DATE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => onDateRangeChange(range.value)}
              className={`
                px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 
                ${
                  dateRange === range.value
                    ? "bg-background text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }
              `}
            >
              {range.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-xs font-medium shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-xs font-semibold shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}