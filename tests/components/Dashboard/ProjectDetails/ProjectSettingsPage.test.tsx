import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const replaceMock = vi.fn();
const searchParamsMock = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/workspaces/acme/projects/web-app/settings",
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => searchParamsMock,
}));

vi.mock("@/hooks/useProjects", () => ({
  useProjectDetailsBySlug: () => ({
    data: {
      id: "proj-1",
      name: "Web App",
      workspaceId: "ws-1",
      color: "#667eea",
      members: [{ userId: "user-1", user: { id: "user-1" }, role: "MANAGER" }],
    },
    isLoading: false,
    isRefetching: false,
  }),
}));

vi.mock("@/hooks/useUser", () => ({
  useUserProfile: () => ({ userId: "user-1", isLoading: false }),
}));

vi.mock("@/hooks/useWorkspace", () => ({
  useWorkspaceRole: () => ({
    isOwner: false,
    isAdmin: false,
    isLoading: false,
  }),
}));

vi.mock("@/components/Dashboard/Workspaces/project/Settings", () => ({
  GeneralTab: () => <div data-testid="tab-general">General content</div>,
  MembersTab: () => <div data-testid="tab-members">Members content</div>,
  AppearanceTab: () => <div data-testid="tab-appearance">Appearance content</div>,
  DangerTab: () => <div data-testid="tab-danger">Danger content</div>,
}));

import { ProjectSettingsPageContent } from "@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/settings/ProjectSettingsPageContent";

describe("ProjectSettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchParamsMock.delete("tab");
  });

  it("defaults to the general tab when no tab param is present", () => {
    render(<ProjectSettingsPageContent workspaceSlug="acme" projectSlug="web-app" />);
    expect(screen.getByTestId("tab-general")).toBeDefined();
  });

  it("restores the active tab from ?tab= in the URL", () => {
    searchParamsMock.set("tab", "members");
    render(<ProjectSettingsPageContent workspaceSlug="acme" projectSlug="web-app" />);
    expect(screen.getByTestId("tab-members")).toBeDefined();
    expect(screen.queryByTestId("tab-general")).toBeNull();
  });

  it("writes the tab to the URL when switching tabs", () => {
    render(<ProjectSettingsPageContent workspaceSlug="acme" projectSlug="web-app" />);
    fireEvent.click(screen.getByRole("button", { name: /members/i }));
    expect(replaceMock).toHaveBeenCalledWith(
      expect.stringContaining("tab=members"),
      { scroll: false },
    );
  });

  it("removes the tab param when returning to the general tab", () => {
    searchParamsMock.set("tab", "members");
    render(<ProjectSettingsPageContent workspaceSlug="acme" projectSlug="web-app" />);
    fireEvent.click(screen.getByRole("button", { name: /general/i }));
    expect(replaceMock).toHaveBeenCalledWith(
      "/dashboard/workspaces/acme/projects/web-app/settings",
      { scroll: false },
    );
  });
});
