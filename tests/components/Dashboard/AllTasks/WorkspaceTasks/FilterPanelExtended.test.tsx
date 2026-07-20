import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterPanel } from "@/components/Dashboard/AllTasks/WorkspaceTasks/FilterPanel";

vi.mock("lucide-react", () => ({
  Tag: (props: any) => <svg data-testid="Tag" {...props} />,
  Brain: (props: any) => <svg data-testid="Brain" {...props} />,
}));

const defaultProps = {
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
  projects: [
    { id: "p1", name: "Project Alpha" },
    { id: "p2", name: "Project Beta" },
  ],
  labels: [
    { id: "l1", name: "Bug", color: "#ff0000" },
    { id: "l2", name: "Feature", color: "#00ff00" },
  ],
  members: [
    { id: "m1", name: "Alice" },
    { id: "m2", name: "Bob" },
  ],
  focusRequired: false,
  onFocusRequiredChange: vi.fn(),
};

describe("FilterPanel - extended", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders all filter select labels", () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
    expect(screen.getByText("Project")).toBeInTheDocument();
    expect(screen.getByText("Assignee")).toBeInTheDocument();
    expect(screen.getByText("Labels")).toBeInTheDocument();
  });

  it("renders project options from data", () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Project Beta")).toBeInTheDocument();
  });

  it("renders member options", () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders multiple labels", () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.getByText("Bug")).toBeInTheDocument();
    expect(screen.getByText("Feature")).toBeInTheDocument();
  });
});
