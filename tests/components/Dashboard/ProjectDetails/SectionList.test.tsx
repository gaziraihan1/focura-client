import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/hooks/useProjectFeatures", () => ({
  useProjectSections: vi.fn(),
  useCreateSection: vi.fn(),
  useUpdateSection: vi.fn(),
  useDeleteSection: vi.fn(),
}));

import SectionList from "@/components/Dashboard/ProjectDetails/SectionList";
import { useProjectSections } from "@/hooks/useProjectFeatures";

describe("SectionList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state", () => {
    (useProjectSections as any).mockReturnValue({ data: null, isLoading: true });
    render(<SectionList projectId="proj1" />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("should show empty state", () => {
    (useProjectSections as any).mockReturnValue({ data: [], isLoading: false });
    render(<SectionList projectId="proj1" />);
    expect(screen.getByText(/No sections yet/i)).toBeDefined();
  });

  it("should render sections with colors", () => {
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
});
