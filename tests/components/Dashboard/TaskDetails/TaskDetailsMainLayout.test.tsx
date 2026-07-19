import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskDetailsMainLayout from "@/components/Dashboard/TaskDetails/TaskDetailsMainLayout";

vi.mock("framer-motion", () => ({
  motion: {
    div: (props: any) => <div {...props} />,
  },
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "user-1" } },
    status: "authenticated",
  }),
}));

vi.mock("@/hooks/useTaskDetailsController", () => ({
  useTaskDetailsController: () => ({
    isEditing: false,
    editData: {},
    mutations: {
      updateTask: { isPending: false },
      addComment: {},
      updateComment: {},
      deleteComment: {},
      uploadAttachment: {},
      deleteAttachment: {},
      updateStatus: { isPending: false },
    },
    handlers: { handleSaveEdit: vi.fn(), handleStatusChange: vi.fn() },
    setIsEditing: vi.fn(),
    setEditData: vi.fn(),
    comments: [],
    attachments: [],
    permissions: { isAssignee: true, isOwner: false, canComment: true, canChangeStatus: true },
  }),
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

describe("TaskDetailsMainLayout", () => {
  it("renders the task title", () => {
    render(<TaskDetailsMainLayout id="t1" isPersonalTask={false} task={mockTask as any} workspaceSlug="ws1" />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("renders the task description", () => {
    render(<TaskDetailsMainLayout id="t1" isPersonalTask={false} task={mockTask as any} workspaceSlug="ws1" />);
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("shows 'No description' when description is empty", () => {
    const taskNoDesc = { ...mockTask, description: "" };
    render(<TaskDetailsMainLayout id="t1" isPersonalTask={false} task={taskNoDesc as any} workspaceSlug="ws1" />);
    expect(screen.getByText("No description provided")).toBeInTheDocument();
  });

  it("renders the task sidebar", () => {
    render(<TaskDetailsMainLayout id="t1" isPersonalTask={false} task={mockTask as any} workspaceSlug="ws1" />);
    expect(screen.getByTestId("task-sidebar")).toBeInTheDocument();
  });
});
