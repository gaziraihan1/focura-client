import { Search, Filter, ArrowUpDown, X } from "lucide-react";
import { motion } from "framer-motion";
import { SortBy } from "@/hooks/useTask";
import { FilterPanel } from "./FilterPanel";

interface Project {
  id: string;
  name: string;
}

interface Label {
  id: string;
  name: string;
  color: string;
}

interface Member {
  id: string;
  name: string;
}

interface TaskSearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFiltersCount: number;
  sortBy: SortBy;
  onSortChange: (sortBy: SortBy) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  selectedProject: string;
  onProjectChange: (project: string) => void;
  selectedAssignee: string;
  onAssigneeChange: (assignee: string) => void;
  selectedLabels: string[];
  onToggleLabel: (labelId: string) => void;
  onClearFilters: () => void;
  projects: Project[];
  labels: Label[];
  members: Member[];
}

export function TaskSearchAndFilters({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  activeFiltersCount,
  sortBy,
  onSortChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  selectedProject,
  onProjectChange,
  selectedAssignee,
  onAssigneeChange,
  selectedLabels,
  onToggleLabel,
  onClearFilters,
  projects,
  labels,
  members,
}: TaskSearchAndFiltersProps) {
  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none"
          />
        </div>

        {/* Filter Button */}
        <button
          onClick={onToggleFilters}
          className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
            showFilters || activeFiltersCount > 0
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-foreground hover:bg-accent"
          }`}
        >
          <Filter size={18} />
          Filters
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary-foreground text-primary text-xs font-medium">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={18} className="text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-border"
        >
          <FilterPanel
            selectedStatus={selectedStatus}
            onStatusChange={onStatusChange}
            selectedPriority={selectedPriority}
            onPriorityChange={onPriorityChange}
            selectedProject={selectedProject}
            onProjectChange={onProjectChange}
            selectedAssignee={selectedAssignee}
            onAssigneeChange={onAssigneeChange}
            selectedLabels={selectedLabels}
            onToggleLabel={onToggleLabel}
            projects={projects}
            labels={labels}
            members={members}
          />

          {activeFiltersCount > 0 && (
            <div className="flex justify-end mt-4">
              <button
                onClick={onClearFilters}
                className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition flex items-center gap-2"
              >
                <X size={16} />
                Clear all filters
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}