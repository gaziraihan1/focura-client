import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/hooks/useProjectFeatures", () => ({
  useMyFavorites: vi.fn(),
  useUpdateFavorite: vi.fn(),
  useToggleFavorite: vi.fn(),
}));

import FavoritesPanel from "@/components/dashboard/projects/project-details/FavoritesPanel";
import { useMyFavorites } from "@/hooks/useProjectFeatures";

describe("FavoritesPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state", () => {
    (useMyFavorites as any).mockReturnValue({ data: null, isLoading: true });
    render(<FavoritesPanel />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("should show empty state", () => {
    (useMyFavorites as any).mockReturnValue({ data: { grouped: [], ungrouped: [] }, isLoading: false });
    render(<FavoritesPanel />);
    expect(screen.getByText(/No favorites yet/i)).toBeDefined();
  });

  it("should render grouped and ungrouped favorites", () => {
    (useMyFavorites as any).mockReturnValue({
      data: {
        grouped: [
          {
            group: "Active",
            favorites: [
              { id: "f1", projectId: "p1", group: "Active", sortOrder: 0, createdAt: "2024-01-01", project: { id: "p1", name: "Project Alpha", slug: "alpha", color: "#667eea", status: "ACTIVE", workspace: { slug: "ws1" } } },
            ],
          },
        ],
        ungrouped: [
          { id: "f2", projectId: "p2", group: null, sortOrder: 1, createdAt: "2024-01-02", project: { id: "p2", name: "Project Beta", slug: "beta", color: null, status: "PLANNING", workspace: { slug: "ws1" } } },
        ],
      },
      isLoading: false,
    });
    render(<FavoritesPanel />);
    expect(screen.getByText("Active")).toBeDefined();
    expect(screen.getByText("Project Alpha")).toBeDefined();
    expect(screen.getByText("Project Beta")).toBeDefined();
  });

  it("should show project status badges", () => {
    (useMyFavorites as any).mockReturnValue({
      data: {
        grouped: [],
        ungrouped: [
          { id: "f1", projectId: "p1", group: null, sortOrder: 0, createdAt: "2024-01-01", project: { id: "p1", name: "Project", slug: "proj", color: null, status: "ACTIVE", workspace: { slug: "ws" } } },
        ],
      },
      isLoading: false,
    });
    render(<FavoritesPanel />);
    expect(screen.getByText("ACTIVE")).toBeDefined();
  });
});
