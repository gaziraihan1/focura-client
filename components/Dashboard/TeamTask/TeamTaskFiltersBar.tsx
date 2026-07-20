"use client";

import { Search, Users, AlertTriangle, Brain } from "lucide-react";

export type TeamTaskScope =
  | "all"
  | "assigned_to_me"
  | "i_assigned"
  | "collaborative";

interface TeamTaskFiltersBarProps {
  scope: TeamTaskScope;
  onScopeChange: (scope: TeamTaskScope) => void;

  search: string;
  onSearchChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;

  priority: string;
  onPriorityChange: (value: string) => void;

  attentionOnly: boolean;
  onAttentionToggle: () => void;
  focusOnly: boolean;
  onFocusToggle: () => void;
}

export function TeamTaskFiltersBar({
  scope,
  onScopeChange,
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  attentionOnly,
  onAttentionToggle,
  focusOnly,
  onFocusToggle,
}: TeamTaskFiltersBarProps) {
  return (
    <div className="rounded-xl bg-card border border-border p-4 space-y-4">
      {/* Scope */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All", icon: Users },
          { key: "assigned_to_me", label: "Assigned to Me" },
          { key: "i_assigned", label: "I Assigned" },
          { key: "collaborative", label: "Collaborative" },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onScopeChange(key as TeamTaskScope)}
            className={`text-xs px-4 py-2 rounded-lg sm:text-sm font-medium flex items-center gap-2 transition ${
              scope === key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            {Icon && <Icon size={16} />}
            {label}
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-4 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search team tasks..."
            className="text-xs sm:text-sm w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:ring-2 ring-primary outline-none"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="text-xs sm:text-sm px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 ring-primary outline-none"
        >
          <option value="all">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="BLOCKED">Blocked</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Priority */}
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="text-xs sm:text-sm px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 ring-primary outline-none"
        >
          <option value="all">All Priority</option>
          <option value="URGENT">Urgent</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        {/* Needs Attention */}
        <button
          onClick={onAttentionToggle}
          className={`text-xs sm:text-sm px-4 py-2 rounded-lg border flex items-center gap-2 transition ${
            attentionOnly
              ? "bg-destructive/10 text-destructive border-destructive/30"
              : "border-border text-muted-foreground hover:bg-accent"
          }`}
        >
          <AlertTriangle size={16} />
          Needs Attention
        </button>

        {/* Focus Needed */}
        <button
          onClick={onFocusToggle}
          className={`text-xs sm:text-sm px-4 py-2 rounded-lg border flex items-center gap-2 transition ${
            focusOnly
              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
              : "border-border text-muted-foreground hover:bg-accent"
          }`}
        >
          <Brain size={16} />
          Focus Needed
        </button>
      </div>
    </div>
  );
}
