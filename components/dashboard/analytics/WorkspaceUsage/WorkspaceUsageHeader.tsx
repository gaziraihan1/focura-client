"use client";

import { useState } from "react";
import { Download, RefreshCw, BarChart3, Check } from "lucide-react";
import type { DateRangeFilter } from "@/types/workspace-usage.types";
import { useExportWorkspaceUsage } from "@/hooks/useWorkspaceUsage";
import { Button } from "@/components/ui/Button";

interface WorkspaceUsageHeaderProps {
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
  workspaceId: string;
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
  workspaceId,
  isRefreshing = false,
  onRefresh,
}: WorkspaceUsageHeaderProps) {
  const { exportToCSV } = useExportWorkspaceUsage();
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    try {
      await exportToCSV(workspaceId, dateRange);
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-5 sm:pb-6 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">
            Workspace Usage
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Engagement & resource consumption overview
          </p>
        </div>
      </div>

      {/* Stack on mobile: filter pills on top, actions below */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        {/* Pills — never push buttons off screen */}
        <div className="flex items-center p-1 rounded-lg bg-muted border border-border gap-0.5 w-fit" role="radiogroup" aria-label="Date range filter">
          {DATE_RANGES.map((range) => (
            <Button
              key={range.value}
              variant="ghost"
              onClick={() => onDateRangeChange(range.value)}
              role="radio"
              aria-checked={dateRange === range.value}
              aria-label={`Last ${range.label === "custom" ? "custom range" : range.label}`}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-colors duration-200 ${
                dateRange === range.value
                  ? "bg-background text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              {range.label}
            </Button>
          ))}
        </div>

        {/* Actions — left-aligned on mobile, pushed right on sm+ */}
        <div className="flex items-center gap-2 sm:ml-auto">
          {onRefresh && (
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label={isRefreshing ? "Refreshing data" : "Refresh data"}
              className="flex gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-xs font-medium shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleExport}
            aria-label={exported ? "Export complete" : "Export data as CSV"}
            className="flex gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold shadow-sm"
          >
            {exported ? (
              <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{exported ? "Exported!" : "Export CSV"}</span>
            <span className="sm:hidden">{exported ? "Done" : "Export"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
