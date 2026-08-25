import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("@/hooks/useProjectFeatures", () => ({
  useProjectViews: vi.fn(),
  useCreateView: vi.fn(),
  useDeleteView: vi.fn(),
  useUpdateView: vi.fn(),
}));

import ViewList from "@/components/dashboard/projects/project-details/ViewList";
import { useProjectViews, useDeleteView, useUpdateView } from "@/hooks/useProjectFeatures";

describe("ViewList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state", () => {
    (useProjectViews as any).mockReturnValue({ data: null, isLoading: true });
    render(<ViewList projectId="proj1" />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("should show an error state when the query fails (e.g. removed from project)", () => {
    (useProjectViews as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Request failed with status code 404"),
    });
    render(<ViewList projectId="proj1" />);
    expect(screen.getByText(/couldn't load views/i)).toBeDefined();
  });

  it("should show empty state", () => {
    (useProjectViews as any).mockReturnValue({ data: [], isLoading: false });
    render(<ViewList projectId="proj1" />);
    expect(screen.getByText(/No saved views yet/i)).toBeDefined();
  });

  it("should render views with type badges", () => {
    (useProjectViews as any).mockReturnValue({
      data: [
        { id: "v1", name: "My Kanban", type: "KANBAN", isDefault: true, visibility: "PRIVATE", createdById: "u1", projectId: "proj1" },
        { id: "v2", name: "Timeline View", type: "TIMELINE", isDefault: false, visibility: "SHARED", createdById: "u2", projectId: "proj1" },
      ],
      isLoading: false,
    });
    render(<ViewList projectId="proj1" />);
    expect(screen.getByText("My Kanban")).toBeDefined();
    expect(screen.getByText("Timeline View")).toBeDefined();
    expect(screen.getByText("KANBAN")).toBeDefined();
    expect(screen.getByText("TIMELINE")).toBeDefined();
    expect(screen.getAllByText("Default").length).toBeGreaterThanOrEqual(1);
  });

  it("opens a confirmation modal before deleting", async () => {
    const deleteView = { mutateAsync: vi.fn() };
    (useProjectViews as any).mockReturnValue({
      data: [{ id: "v1", name: "My Kanban", type: "KANBAN", isDefault: false, visibility: "PRIVATE", createdById: "u1", projectId: "proj1" }],
      isLoading: false,
    });
    (useDeleteView as any).mockReturnValue(deleteView);

    render(<ViewList projectId="proj1" />);
    fireEvent.click(screen.getByLabelText("Delete view My Kanban"));
    expect(screen.getByText("Delete view?")).toBeDefined();
    fireEvent.click(screen.getAllByRole("button").find((b) => b.textContent === "Delete")!);
    expect(deleteView.mutateAsync).toHaveBeenCalledWith({ viewId: "v1", projectId: "proj1" });
  });

  it("sets a view as default via the Set default button", () => {
    const updateView = { mutateAsync: vi.fn() };
    (useProjectViews as any).mockReturnValue({
      data: [{ id: "v1", name: "My Kanban", type: "KANBAN", isDefault: false, visibility: "PRIVATE", createdById: "u1", projectId: "proj1" }],
      isLoading: false,
    });
    (useUpdateView as any).mockReturnValue(updateView);

    render(<ViewList projectId="proj1" />);
    fireEvent.click(screen.getByText("Set default"));
    expect(updateView.mutateAsync).toHaveBeenCalledWith({ viewId: "v1", projectId: "proj1", isDefault: true });
  });
});
