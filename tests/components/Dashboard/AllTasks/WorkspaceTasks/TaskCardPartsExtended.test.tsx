import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  TaskCardHeader,
  TaskCardMetaChips,
  TaskCardProgressAssignees,
} from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskCardParts";
import type { Task } from "@/hooks/useTask";

vi.mock("lucide-react", () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    CheckCircle2: icon("CheckCircle2"),
    TrendingUp: icon("TrendingUp"),
    Clock: icon("Clock"),
    Flag: icon("Flag"),
    Folder: icon("Folder"),
    Timer: icon("Timer"),
    AlertCircle: icon("AlertCircle"),
    Calendar: icon("Calendar"),
    Plus: icon("Plus"),
    Loader2: icon("Loader2"),
  };
});

vi.mock("@/utils/task.utils", () => ({
  formatTimeDuration: (h: number) => `${h}h left`,
  getPriorityColor: () => "text-red-500",
  getStatusColor: () => "bg-blue-500",
  getTimeStatusColor: () => "text-green-500",
}));

vi.mock("@/utils/taskcard.utils", () => ({
  formatHoursSinceCreation: (h: number) => `${h}h`,
}));

const baseTask: Task = {
  id: "t1",
  title: "Test Task",
  description: "A test description",
  status: "TODO",
  priority: "HIGH",
  dueDate: null,
  createdBy: { id: "u1", name: "Alice" },
  assignees: [],
  _count: { comments: 0, subtasks: 0, files: 0 },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("TaskCardHeader - extended", () => {
  const defaults = {
    task: baseTask,
    showButtons: false,
    isPrimaryDisabled: false,
    isInPrimary: false,
    isInSecondary: false,
    primaryDisabled: false,
    secondaryDisabled: false,
    isPrimaryLoading: false,
    isSecondaryLoading: false,
    handlePrimaryClick: vi.fn(),
    handleSecondaryClick: vi.fn(),
  };

  it("hides action buttons when showButtons is false", () => {
    render(<TaskCardHeader {...defaults} showButtons={false} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders CheckCircle2 for completed task", () => {
    render(<TaskCardHeader {...defaults} task={{ ...baseTask, status: "COMPLETED" }} />);
    expect(screen.getByTestId("CheckCircle2")).toBeInTheDocument();
  });

  it("shows primary button disabled state", () => {
    render(<TaskCardHeader {...defaults} showButtons primaryDisabled />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled();
  });
});

describe("TaskCardMetaChips - extended", () => {
  it("renders time tracking when present", () => {
    const task = {
      ...baseTask,
      timeTracking: { hoursSinceCreation: 5, hoursUntilDue: 48 },
    };
    render(<TaskCardMetaChips task={task} />);
    expect(screen.getByText("5h ago")).toBeInTheDocument();
  });

  it("renders engagement counts when present", () => {
    const task = {
      ...baseTask,
      _count: { comments: 3, subtasks: 2, files: 1 },
    };
    render(<TaskCardMetaChips task={task} />);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});

describe("TaskCardProgressAssignees - extended", () => {
  it("renders progress bar when progress is provided", () => {
    const task = { ...baseTask, estimatedHours: 10 };
    render(<TaskCardProgressAssignees task={task} progress={50} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("shows overflow count when more than 4 assignees", () => {
    const task = {
      ...baseTask,
      assignees: [
        { user: { id: "u1", name: "Alice" } },
        { user: { id: "u2", name: "Bob" } },
        { user: { id: "u3", name: "Carol" } },
        { user: { id: "u4", name: "Dave" } },
        { user: { id: "u5", name: "Eve" } },
      ],
    };
    render(<TaskCardProgressAssignees task={task} progress={null} />);
    expect(screen.getByText("+1")).toBeInTheDocument();
  });
});
