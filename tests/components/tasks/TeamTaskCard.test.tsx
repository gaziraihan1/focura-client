import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamTaskCard } from "@/components/tasks/unified-task-card/variants/TeamTaskCard";
import type { Task } from "@/hooks/useTask";

// framer-motion's `m` components need a MotionConfig/proximity DOM — stub them.
vi.mock("framer-motion", () => ({
  m: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  },
}));

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "t1",
    title: "Team Task",
    description: null,
    status: "IN_PROGRESS",
    priority: "HIGH",
    startDate: null,
    dueDate: null,
    estimatedHours: null,
    focusRequired: false,
    createdBy: { id: "u1", name: "Owner", email: "o@x.co", image: null },
    assignees: [],
    project: {
      id: "p1",
      slug: "proj",
      name: "Legacy Project",
      color: "#667eea",
      status: "ACTIVE",
      workspaceId: "ws1",
      // Legacy rows: compound FK (workspaceId, workspaceSlug) unresolved → null
      workspace: null,
    },
    _count: { comments: 0, subtasks: 0, files: 0 },
    ...overrides,
  } as unknown as Task;
}

describe("TeamTaskCard", () => {
  it("renders project name without crashing when project.workspace is null", () => {
    render(
      <TeamTaskCard
        task={makeTask()}
        cardHref="/tasks/t1"
        isCompleted={false}
        showDescription
        showProject
        showTimeTracking
        showStatusPill
        showPriorityFlag
      />
    );

    expect(screen.getByText("Team Task")).toBeInTheDocument();
    expect(screen.getByText("Legacy Project")).toBeInTheDocument();
    expect(screen.getByText("No workspace")).toBeInTheDocument();
  });

  it("renders the workspace name when present", () => {
    render(
      <TeamTaskCard
        task={makeTask({
          project: {
            id: "p2",
            slug: "proj-2",
            name: "Normal Project",
            color: "#22c55e",
            status: "ACTIVE",
            workspaceId: "ws1",
            workspace: { id: "ws1", name: "Acme", slug: "acme" },
          },
        } as unknown as Partial<Task>)}
        cardHref="/tasks/t2"
        isCompleted={false}
        showDescription={false}
        showProject
        showTimeTracking={false}
        showStatusPill
        showPriorityFlag={false}
      />
    );

    expect(screen.getByText("Normal Project")).toBeInTheDocument();
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  it("hides the project block when task.project is null", () => {
    render(
      <TeamTaskCard
        task={makeTask({ project: null } as unknown as Partial<Task>)}
        cardHref="/tasks/t3"
        isCompleted={false}
        showDescription={false}
        showProject
        showTimeTracking={false}
        showStatusPill
        showPriorityFlag={false}
      />
    );

    expect(screen.queryByText("No workspace")).not.toBeInTheDocument();
  });
});
