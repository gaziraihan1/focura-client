"use client";

import { Search, Users, AlertTriangle } from "lucide-react";

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
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
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
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search team tasks..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:ring-2 ring-primary outline-none"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 ring-primary outline-none"
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
          className="px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 ring-primary outline-none"
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
          className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-sm transition ${
            attentionOnly
              ? "bg-destructive/10 text-destructive border-destructive/30"
              : "border-border text-muted-foreground hover:bg-accent"
          }`}
        >
          <AlertTriangle size={16} />
          Needs Attention
        </button>
      </div>
    </div>
  );
}
