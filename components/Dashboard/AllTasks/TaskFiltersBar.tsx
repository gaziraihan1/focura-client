import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type Sorting = "title" | "status" | "priority" | "dueDate" | "createdAt" | undefined;

interface TaskFiltersBarProps {
  activeTab: "all" | "personal" | "assigned";
  onTabChange: (tab: "all" | "personal" | "assigned") => void;

  searchQuery: string;
  onSearchChange: (value: string) => void;

  selectedStatus: string;
  onStatusChange: (status: string) => void;

  selectedPriority: string;
  onPriorityChange: (priority: string) => void;

  sortBy: Sorting;
  sortOrder?: "asc" | "desc";
  onSortChange: (v: Sorting) => void;
}

export function TaskFiltersBar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  sortBy,
  sortOrder,
  onSortChange,
}: TaskFiltersBarProps) {
  const tabs = [
    { value: "all", label: "All Tasks" },
    { value: "personal", label: "Personal" },
    { value: "assigned", label: "Assigned" },
  ] as const;

  const getSortIcon = () => {
    if (!sortOrder) return <ArrowUpDown size={18} />;
    return sortOrder === 'asc' ? <ArrowUp size={18} /> : <ArrowDown size={18} />;
  };

  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
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

        {/* Status */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
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
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
        >
          <option value="all">All Priority</option>
          <option value="URGENT">Urgent</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="text-muted-foreground">
            {getSortIcon()}
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as Sorting)}
            className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
    </div>
  );
}