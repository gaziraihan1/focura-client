import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/hooks/useProjectFeatures", () => ({
  useProjectViews: vi.fn(),
  useCreateView: vi.fn(),
  useDeleteView: vi.fn(),
}));

import ViewList from "@/components/Dashboard/ProjectDetails/ViewList";
import { useProjectViews } from "@/hooks/useProjectFeatures";

describe("ViewList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state", () => {
    (useProjectViews as any).mockReturnValue({ data: null, isLoading: true });
    render(<ViewList projectId="proj1" />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
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
    expect(screen.getByText("Default")).toBeDefined();
  });
});
