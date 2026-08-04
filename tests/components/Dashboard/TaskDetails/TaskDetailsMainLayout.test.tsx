import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskDetailsMainLayout from "@/components/Dashboard/TaskDetails/TaskDetailsMainLayout";

vi.mock("framer-motion", () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
  },
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "user-1" } },
    status: "authenticated",
  }),
}));

vi.mock("@/components/Dashboard/ProjectDetails/TaskSectionBadge", () => ({
  TaskSectionBadge: () => null,
}));

vi.mock("@/components/Dashboard/TaskDetails/TaskDetailsForm", () => ({
  TaskDetailsForm: () => <div data-testid="task-details-form" />,
}));

vi.mock("@/components/Dashboard/TaskDetails/TaskTab", () => ({
  TaskTabs: () => <div data-testid="task-tabs" />,
}));

vi.mock("@/components/Dashboard/TaskDetails/TaskSidebar", () => ({
  TaskSidebar: () => <div data-testid="task-sidebar" />,
}));

vi.mock("@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskSection", () => ({
  SubtaskSection: () => <div data-testid="subtask-section" />,
}));

const mockTask = {
  id: "t1",
  title: "Test Task",
  description: "Test description",
  status: "TODO",
  priority: "HIGH",
};

const defaultProps = {
  task: mockTask as any,
  isPersonalTask: false,
  workspaceSlug: "ws1",
  isEditing: false,
  editData: {
    title: "Test Task",
    description: "Test description",
    priority: "HIGH",
    status: "TODO",
    estimatedHours: "",
  },
  setIsEditing: vi.fn(),
  setEditData: vi.fn(),
  comments: [],
  attachments: [],
  permissions: { isAssignee: true, isOwner: false, canComment: true, canChangeStatus: true },
  handlers: { handleSaveEdit: vi.fn(), handleStatusChange: vi.fn() },
  mutations: {
    updateTask: { isPending: false },
    updateStatus: { isPending: false },
  },
};

describe("TaskDetailsMainLayout", () => {
  it("renders the task title", () => {
    render(<TaskDetailsMainLayout {...(defaultProps as any)} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("renders the task description", () => {
    render(<TaskDetailsMainLayout {...(defaultProps as any)} />);
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("shows 'No description' when description is empty", () => {
    render(<TaskDetailsMainLayout {...(defaultProps as any)} task={{ ...mockTask, description: "" }} />);
    expect(screen.getByText("No description provided")).toBeInTheDocument();
  });

  it("renders the task sidebar", () => {
    render(<TaskDetailsMainLayout {...(defaultProps as any)} />);
    expect(screen.getByTestId("task-sidebar")).toBeInTheDocument();
  });

  it("renders the edit form when isEditing is true", () => {
    render(<TaskDetailsMainLayout {...(defaultProps as any)} isEditing />);
    expect(screen.getByTestId("task-details-form")).toBeInTheDocument();
  });

  it("does not render the edit form when not editing", () => {
    render(<TaskDetailsMainLayout {...(defaultProps as any)} />);
    expect(screen.queryByTestId("task-details-form")).not.toBeInTheDocument();
  });
});
