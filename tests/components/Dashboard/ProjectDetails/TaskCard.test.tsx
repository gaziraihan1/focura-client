import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskCard from "@/components/Dashboard/ProjectDetails/TaskCard";
import type { Task } from "@/hooks/useTask";

vi.mock("next/navigation", () => ({
  useParams: () => ({ workspaceSlug: "acme", projectSlug: "web-app" }),
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
}));

function makeTask(id: string, title: string): Task {
  return {
    id,
    title,
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: null,
    createdBy: { id: "u1", name: "User" },
    assignees: [],
    project: { id: "proj1", slug: "web-app", name: "Web App", color: "#667eea", workspace: { id: "ws1", name: "Acme" } },
    _count: { comments: 0, subtasks: 0, files: 0 },
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  };
}

describe("TaskCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the task title and priority", () => {
    render(<TaskCard task={makeTask("t1", "Build navbar")} workspaceSlug="acme" />);
    expect(screen.getByText("Build navbar")).toBeDefined();
  });

  it("shows the section badge when the task belongs to a section", () => {
    render(
      <TaskCard
        task={makeTask("t1", "Build navbar")}
        workspaceSlug="acme"
        section={{ name: "Frontend", color: "#667eea" }}
      />,
    );
    expect(screen.getByText("Frontend")).toBeDefined();
  });

  it("does not render a badge when the task has no section", () => {
    render(<TaskCard task={makeTask("t1", "Build navbar")} workspaceSlug="acme" section={null} />);
    expect(screen.queryByText(/Frontend/i)).toBeNull();
  });
});
