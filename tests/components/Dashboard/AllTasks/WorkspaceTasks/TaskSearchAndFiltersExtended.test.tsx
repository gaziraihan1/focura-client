import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskSearchAndFilters } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskSearchAndFilters";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}));

vi.mock("lucide-react", () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    Search: icon("Search"),
    Filter: icon("Filter"),
    ArrowUpDown: icon("ArrowUpDown"),
    ArrowUp: icon("ArrowUp"),
    ArrowDown: icon("ArrowDown"),
    X: icon("X"),
  };
});

vi.mock("@/components/Dashboard/AllTasks/WorkspaceTasks/FilterPanel", () => ({
  FilterPanel: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="filter-panel" />,
}));

const defaultProps = {
  searchQuery: "",
  onSearchChange: vi.fn(),
  showFilters: false,
  onToggleFilters: vi.fn(),
  activeFiltersCount: 0,
  sortBy: "dueDate" as const,
  onSortChange: vi.fn(),
  selectedStatus: "all",
  onStatusChange: vi.fn(),
  selectedPriority: "all",
  onPriorityChange: vi.fn(),
  selectedProject: "all",
  onProjectChange: vi.fn(),
  selectedAssignee: "all",
  onAssigneeChange: vi.fn(),
  selectedLabels: [],
  onToggleLabel: vi.fn(),
  onClearFilters: vi.fn(),
  projects: [],
  labels: [],
  members: [],
  focusRequired: false,
  onFocusRequiredChange: vi.fn(),
};

describe("TaskSearchAndFilters - extended", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders sort select with default value", () => {
    render(<TaskSearchAndFilters {...defaultProps} />);
    expect(screen.getByDisplayValue("Due Date")).toBeInTheDocument();
  });

  it("shows ascending text when sortOrder is asc", () => {
    render(<TaskSearchAndFilters {...defaultProps} sortOrder="asc" />);
    expect(screen.getByText("(Ascending)")).toBeInTheDocument();
  });

  it("shows descending text when sortOrder is desc", () => {
    render(<TaskSearchAndFilters {...defaultProps} sortOrder="desc" />);
    expect(screen.getByText("(Descending)")).toBeInTheDocument();
  });

  it("shows clear filters button when activeFiltersCount > 0 and filters shown", () => {
    render(
      <TaskSearchAndFilters
        {...defaultProps}
        showFilters
        activeFiltersCount={2}
      />
    );
    expect(screen.getByText("Clear all filters")).toBeInTheDocument();
  });
});
