import { describe, it, expect } from "vitest";
import { buildWorkflowColumns, mergeBoardColumns, assignTasksToColumns } from "@/utils/workflow";
import type { ProjectSectionItem } from "@/hooks/useProjectFeatures";

function makeSection(
  overrides: Partial<ProjectSectionItem> & { id: string },
): ProjectSectionItem {
  return {
    name: "Column",
    status: "ACTIVE",
    position: 0,
    projectId: "p1",
    ...overrides,
  };
}

describe("buildWorkflowColumns", () => {
  it("maps ACTIVE sections with a taskStatus to columns ordered by position", () => {
    const sections = [
      makeSection({ id: "s1", name: "In Progress", taskStatus: "IN_PROGRESS", position: 1 }),
      makeSection({ id: "s2", name: "Backlog", taskStatus: "TODO", position: 0 }),
    ];
    const result = buildWorkflowColumns(sections);
    expect(result).toEqual([
      { status: "TODO", label: "Backlog", color: "#667eea", sectionId: "s2" },
      { status: "IN_PROGRESS", label: "In Progress", color: "#667eea", sectionId: "s1" },
    ]);
  });

  it("preserves the section color", () => {
    const sections = [
      makeSection({ id: "s1", name: "Review", taskStatus: "IN_REVIEW", color: "#a855f7" }),
    ];
    expect(buildWorkflowColumns(sections)).toEqual([
      { status: "IN_REVIEW", label: "Review", color: "#a855f7", sectionId: "s1" },
    ]);
  });

  it("defaults missing color to the brand color", () => {
    const sections = [makeSection({ id: "s1", name: "Done", taskStatus: "COMPLETED" })];
    expect(buildWorkflowColumns(sections)?.[0]).toMatchObject({ color: "#667eea", sectionId: "s1" });
  });

  it("skips non-ACTIVE sections", () => {
    const sections = [
      makeSection({ id: "s1", name: "Archived", taskStatus: "TODO", status: "COMPLETED" }),
      makeSection({ id: "s2", name: "Pending", taskStatus: "IN_PROGRESS", status: "PENDING" }),
    ];
    expect(buildWorkflowColumns(sections)).toBeNull();
  });

  it("skips sections without a taskStatus mapping", () => {
    const sections = [makeSection({ id: "s1", name: "No mapping" })];
    expect(buildWorkflowColumns(sections)).toBeNull();
  });

  it("returns null for empty sections", () => {
    expect(buildWorkflowColumns([])).toBeNull();
  });

  it("returns null when no ACTIVE mapped section exists but others do", () => {
    const sections = [
      makeSection({ id: "s1", name: "Untracked", status: "ACTIVE" }),
      makeSection({ id: "s2", name: "Old", status: "COMPLETED", taskStatus: "TODO" }),
    ];
    expect(buildWorkflowColumns(sections)).toBeNull();
  });

  it("is stable across equal positions", () => {
    const sections = [
      makeSection({ id: "s1", name: "A", taskStatus: "TODO", position: 1 }),
      makeSection({ id: "s2", name: "B", taskStatus: "IN_PROGRESS", position: 1 }),
    ];
    const result = buildWorkflowColumns(sections);
    expect(result).toHaveLength(2);
    expect(result?.map((c) => c.label)).toEqual(["A", "B"]);
  });
});

describe("mergeBoardColumns", () => {
  const defaults = [
    { status: "TODO", label: "To Do", icon: null, color: "text-muted-foreground" },
    { status: "IN_PROGRESS", label: "In Progress", icon: null, color: "text-blue-500" },
    { status: "IN_REVIEW", label: "In Review", icon: null, color: "text-amber-500" },
  ];

  it("returns the defaults unchanged when there is no workflow", () => {
    expect(mergeBoardColumns(null, defaults)).toEqual(defaults);
  });

  it("keeps workflow columns and appends defaults for uncovered statuses", () => {
    const workflow = [
      { status: "TODO", label: "Backlog", color: "#94a3b8", sectionId: "s1" },
      { status: "IN_PROGRESS", label: "Frontend", color: "#3b82f6", sectionId: "s2" },
    ];
    const result = mergeBoardColumns(workflow, defaults);
    expect(result).toEqual([
      { status: "TODO", label: "Backlog", color: "#94a3b8", sectionId: "s1" },
      { status: "IN_PROGRESS", label: "Frontend", color: "#3b82f6", sectionId: "s2" },
      { status: "IN_REVIEW", label: "In Review", icon: null, color: "text-amber-500" },
    ]);
  });

  it("does not duplicate a status covered by the workflow", () => {
    const workflow = [
      { status: "TODO", label: "Backlog", color: "#94a3b8", sectionId: "s1" },
      { status: "IN_REVIEW", label: "Review", color: "#a855f7", sectionId: "s2" },
    ];
    const result = mergeBoardColumns(workflow, defaults);
    const statuses = result.map((c) => c.status);
    expect(statuses).toEqual(["TODO", "IN_REVIEW", "IN_PROGRESS"]);
    expect(result).toHaveLength(3);
  });
});

describe("assignTasksToColumns", () => {
  const columns = [
    { status: "TODO", sectionId: undefined },
    { status: "IN_PROGRESS", sectionId: "sec-2" },
    { status: "IN_REVIEW", sectionId: undefined },
  ];

  it("places unassigned tasks by their status", () => {
    const tasks = [
      { id: "t1", status: "TODO" },
      { id: "t2", status: "IN_REVIEW" },
    ];
    const result = assignTasksToColumns(columns, tasks);
    expect(result.get("TODO")?.map((t) => t.id)).toEqual(["t1"]);
    expect(result.get("IN_REVIEW")?.map((t) => t.id)).toEqual(["t2"]);
    expect(result.get("IN_PROGRESS")).toEqual([]);
  });

  it("shows a section-assigned task only in its section column", () => {
    const tasks = [{ id: "t1", status: "TODO", sectionId: "sec-2" }];
    const result = assignTasksToColumns(columns, tasks);
    expect(result.get("IN_PROGRESS")?.map((t) => t.id)).toEqual(["t1"]);
    expect(result.get("TODO")).toEqual([]);
  });

  it("falls back to status when sectionId no longer matches a column", () => {
    const tasks = [{ id: "t1", status: "TODO", sectionId: "sec-deleted" }];
    const result = assignTasksToColumns(columns, tasks);
    expect(result.get("TODO")?.map((t) => t.id)).toEqual(["t1"]);
  });

  it("keeps tasks with a matching section and status in the section only", () => {
    const tasks = [{ id: "t1", status: "IN_PROGRESS", sectionId: "sec-2" }];
    const result = assignTasksToColumns(columns, tasks);
    expect(result.get("IN_PROGRESS")?.map((t) => t.id)).toEqual(["t1"]);
  });

  it("handles empty tasks", () => {
    const result = assignTasksToColumns(columns, []);
    expect([...result.values()].every((list) => list.length === 0)).toBe(true);
  });
});
