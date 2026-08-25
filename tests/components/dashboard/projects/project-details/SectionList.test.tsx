import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/hooks/useProjectFeatures", () => ({
  useProjectSections: vi.fn(),
  useCreateSection: vi.fn(),
  useUpdateSection: vi.fn(),
  useDeleteSection: vi.fn(),
  useReorderSections: vi.fn(),
}));

import SectionList from "@/components/dashboard/projects/project-details/SectionList";
import {
  useProjectSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useReorderSections,
} from "@/hooks/useProjectFeatures";

function mockMutations() {
  const create = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false };
  const update = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false };
  const reorder = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false };
  const del = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false };
  (useCreateSection as any).mockReturnValue(create);
  (useUpdateSection as any).mockReturnValue(update);
  (useReorderSections as any).mockReturnValue(reorder);
  (useDeleteSection as any).mockReturnValue(del);
  return { create, update, reorder, del };
}

describe("SectionList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mocks so every render (even empty/loading states) has valid hooks.
    (useCreateSection as any).mockReturnValue({ mutateAsync: vi.fn().mockResolvedValue({}), isPending: false });
    (useUpdateSection as any).mockReturnValue({ mutateAsync: vi.fn().mockResolvedValue({}), isPending: false });
    (useDeleteSection as any).mockReturnValue({ mutateAsync: vi.fn().mockResolvedValue({}), isPending: false });
    (useReorderSections as any).mockReturnValue({ mutateAsync: vi.fn().mockResolvedValue({}), isPending: false });
  });

  it("should show loading state", () => {
    (useProjectSections as any).mockReturnValue({ data: null, isLoading: true });
    render(<SectionList projectId="proj1" />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("should show an error state when the query fails (e.g. removed from project)", () => {
    (useProjectSections as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Request failed with status code 404"),
    });
    render(<SectionList projectId="proj1" />);
    expect(screen.getByText(/couldn't load sections/i)).toBeDefined();
  });

  it("should show empty state", () => {
    (useProjectSections as any).mockReturnValue({ data: [], isLoading: false });
    render(<SectionList projectId="proj1" />);
    expect(screen.getByText(/No sections yet/i)).toBeDefined();
  });

  it("should render sections with colors", () => {
    mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [
        { id: "sec1", name: "Backend", color: "#667eea", status: "ACTIVE", position: 0, projectId: "proj1" },
        { id: "sec2", name: "Frontend", color: "#10b981", status: "COMPLETED", position: 1, projectId: "proj1" },
        { id: "sec3", name: "Design", color: "#f59e0b", status: "PENDING", position: 2, projectId: "proj1" },
      ],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" />);
    expect(screen.getByText("Backend")).toBeDefined();
    expect(screen.getByText("Frontend")).toBeDefined();
    expect(screen.getByText("Design")).toBeDefined();
    expect(screen.getByText("COMPLETED")).toBeDefined();
    expect(screen.getByText("PENDING")).toBeDefined();
  });

  it("should render WIP limit inputs and status selects for each section", () => {
    mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [
        { id: "sec1", name: "Backlog", status: "ACTIVE", position: 0, projectId: "proj1", wipLimit: 20, taskStatus: "TODO" },
      ],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" />);
    expect(screen.getByLabelText("WIP limit for Backlog")).toBeDefined();
    expect(screen.getByLabelText("Status for Backlog")).toBeDefined();
    expect((screen.getByLabelText("Status for Backlog") as HTMLSelectElement).value).toBe("TODO");
  });

  it("should reorder sections when the down button is clicked", async () => {
    const { reorder } = mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [
        { id: "sec1", name: "Backlog", status: "ACTIVE", position: 0, projectId: "proj1", taskStatus: "TODO" },
        { id: "sec2", name: "In Progress", status: "ACTIVE", position: 1, projectId: "proj1", taskStatus: "IN_PROGRESS" },
      ],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" />);
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("Move Backlog right"));
    expect(reorder.mutateAsync).toHaveBeenCalledWith({
      projectId: "proj1",
      sectionIds: ["sec2", "sec1"],
    });
  });

  it("should disable the up button on the first section", () => {
    mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [
        { id: "sec1", name: "Backlog", status: "ACTIVE", position: 0, projectId: "proj1" },
        { id: "sec2", name: "In Progress", status: "ACTIVE", position: 1, projectId: "proj1" },
      ],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" />);
    expect(screen.getByLabelText("Move Backlog left")).toHaveProperty("disabled", true);
    expect(screen.getByLabelText("Move In Progress right")).toHaveProperty("disabled", true);
  });

  it("should update the task status mapping", async () => {
    const { update } = mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [
        { id: "sec1", name: "Backlog", status: "ACTIVE", position: 0, projectId: "proj1", taskStatus: "TODO" },
      ],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" />);
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText("Status for Backlog"), "IN_PROGRESS");
    expect(update.mutateAsync).toHaveBeenCalledWith({
      sectionId: "sec1",
      projectId: "proj1",
      taskStatus: "IN_PROGRESS",
    });
  });

  it("should update the WIP limit on blur", async () => {
    const { update } = mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [
        { id: "sec1", name: "Backlog", status: "ACTIVE", position: 0, projectId: "proj1", wipLimit: 20 },
      ],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" />);
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    const input = screen.getByLabelText("WIP limit for Backlog");
    await user.clear(input);
    await user.type(input, "8");
    await user.tab();
    expect(update.mutateAsync).toHaveBeenCalledWith({
      sectionId: "sec1",
      projectId: "proj1",
      wipLimit: 8,
    });
  });

  it("should ignore an invalid WIP limit", async () => {
    const { update } = mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [
        { id: "sec1", name: "Backlog", status: "ACTIVE", position: 0, projectId: "proj1", wipLimit: 20 },
      ],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" />);
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    const input = screen.getByLabelText("WIP limit for Backlog");
    await user.clear(input);
    await user.type(input, "-5");
    await user.tab();
    expect(update.mutateAsync).not.toHaveBeenCalled();
  });

  it("should create a section without a status by default (board stays untouched)", async () => {
    const { create } = mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [
        { id: "sec1", name: "Backlog", status: "ACTIVE", position: 0, projectId: "proj1", taskStatus: "TODO" },
      ],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" />);
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    await user.click(screen.getByText("Add Section"));
    await user.type(screen.getByPlaceholderText(/Section name/i), "Backend");
    await user.click(screen.getByText("Add Section"));
    // No taskStatus sent → the new section never claims an existing board column
    expect(create.mutateAsync).toHaveBeenCalledWith({
      name: "Backend",
      description: undefined,
      color: "#667eea",
      taskStatus: undefined,
      wipLimit: 20,
      projectId: "proj1",
    });
  });

  it("should keep the 'No status' option selectable on existing sections", () => {
    mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [
        { id: "sec1", name: "Backlog", status: "ACTIVE", position: 0, projectId: "proj1", taskStatus: "TODO" },
      ],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" />);
    const select = screen.getByLabelText("Status for Backlog") as HTMLSelectElement;
    const noStatusOption = select.options[0];
    expect(noStatusOption.value).toBe("");
    expect(noStatusOption.disabled).toBe(false);
  });

  it("should clear a section's status mapping when 'No status' is selected", async () => {
    const { update } = mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [
        { id: "sec1", name: "Backlog", status: "ACTIVE", position: 0, projectId: "proj1", taskStatus: "TODO" },
      ],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" />);
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText("Status for Backlog"), "");
    expect(update.mutateAsync).toHaveBeenCalledWith({
      sectionId: "sec1",
      projectId: "proj1",
      taskStatus: null,
    });
  });

  it("should show the folder-only hint in the create form", async () => {
    mockMutations();
    (useProjectSections as any).mockReturnValue({ data: [], isLoading: false });
    render(<SectionList projectId="proj1" />);
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    await user.click(screen.getByText("Add Section"));
    expect(screen.getByText(/folder-only section/i)).toBeDefined();
  });

  it("should open the delete confirmation modal and cancel without deleting", async () => {
    const { del } = mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [{ id: "sec1", name: "Backlog", status: "ACTIVE", position: 0, projectId: "proj1" }],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" />);
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("Delete Backlog"));
    expect(screen.getByText(/Delete section/)).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(del.mutateAsync).not.toHaveBeenCalled();
    expect(screen.queryByText(/Delete section/)).toBeNull();
  });

  it("should delete a section only after confirming in the modal", async () => {
    const { del } = mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [{ id: "sec1", name: "Backlog", status: "ACTIVE", position: 0, projectId: "proj1" }],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" />);
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("Delete Backlog"));
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(del.mutateAsync).toHaveBeenCalledWith({ sectionId: "sec1", projectId: "proj1" });
  });

  it("should show the task count on each section card", () => {
    mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [
        { id: "sec1", name: "Backlog", status: "ACTIVE", position: 0, projectId: "proj1", _count: { tasks: 3 } },
      ],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" />);
    expect(screen.getByText("3 tasks")).toBeDefined();
  });

  it("should render a view-tasks link when tasksBaseHref is provided", () => {
    mockMutations();
    (useProjectSections as any).mockReturnValue({
      data: [{ id: "sec1", name: "Backlog", status: "ACTIVE", position: 0, projectId: "proj1" }],
      isLoading: false,
    });
    render(<SectionList projectId="proj1" tasksBaseHref="/dashboard/workspaces/acme/projects/web-app" />);
    const link = screen.getByRole("link", { name: /View tasks/i });
    expect(link.getAttribute("href")).toBe("/dashboard/workspaces/acme/projects/web-app/tasks?section=sec1");
  });

  it("should create a section with a status and WIP limit", async () => {
    const { create } = mockMutations();
    (useProjectSections as any).mockReturnValue({ data: [], isLoading: false });
    render(<SectionList projectId="proj1" />);
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    await user.click(screen.getByText("Add Section"));
    await user.type(screen.getByPlaceholderText(/Section name/i), "Backend");
    await user.selectOptions(screen.getByLabelText("Status for new section"), "IN_REVIEW");
    await user.click(screen.getByText("Add Section"));
    expect(create.mutateAsync).toHaveBeenCalledWith({
      name: "Backend",
      description: undefined,
      color: "#667eea",
      taskStatus: "IN_REVIEW",
      wipLimit: 20,
      projectId: "proj1",
    });
  });
});
