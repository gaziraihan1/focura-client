// components/Projects/ProjectFilters.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid3x3, List } from "lucide-react";
import { ViewMode, ProjectFilters as Filters, WorkspaceData } from "@/types/project.types";

interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  activeFiltersCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  workspaces: WorkspaceData[];
}

export function ProjectFilters({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  filters,
  onFiltersChange,
  activeFiltersCount,
  viewMode,
  onViewModeChange,
  workspaces,
}: ProjectFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-card border border-border shadow-sm p-5"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects by name, description, or workspace..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary/50 outline-none transition"
          />
        </div>

        {/* Filter Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggleFilters}
          className={`px-5 py-3.5 rounded-xl border transition flex items-center gap-2.5 font-medium ${
            showFilters || activeFiltersCount > 0
              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
              : "border-border text-foreground hover:bg-accent"
          }`}
        >
          <Filter size={18} />
          Filters
          {activeFiltersCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-primary-foreground text-primary text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </motion.button>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-muted/50 border border-border/50">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2.5 rounded-lg transition ${
              viewMode === "grid"
                ? "bg-background shadow-sm border border-border"
                : "hover:bg-background/50"
            }`}
          >
            <Grid3x3 size={18} />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2.5 rounded-lg transition ${
              viewMode === "list"
                ? "bg-background shadow-sm border border-border"
                : "hover:bg-background/50"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 pt-5 border-t border-border"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Workspace Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Workspace
                </label>
                <select
                  value={filters.workspace}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, workspace: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:ring-2 ring-primary/50 outline-none"
                >
                  <option value="all">All Workspaces</option>
                  {workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, status: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:ring-2 ring-primary/50 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="PLANNING">Planning</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, priority: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:ring-2 ring-primary/50 outline-none"
                >
                  <option value="all">All Priority</option>
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() =>
                    onFiltersChange({ status: "all", priority: "all", workspace: "all" })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-border hover:bg-accent text-foreground transition font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}