import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("lucide-react", () => ({
  Activity: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-activity" {...props} />,
}));

vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("@/components/shared/Avatar", () => ({
  Avatar: () => <div data-testid="avatar" />,
}));

vi.mock("@/components/shared/Pagination", () => ({
  Pagination: ({ currentPage, totalPages }: Record<string, unknown>) => (
    <div data-testid="pagination">Page {currentPage} of {totalPages}</div>
  ),
}));

vi.mock("@/hooks/useAdmin", () => ({
  useAdminActivity: vi.fn(() => ({
    data: { data: [], pagination: { totalCount: 0, totalPages: 1 } },
    isLoading: false,
  })),
  useAdminPagination: vi.fn(() => ({ page: 1, setPage: vi.fn() })),
}));

const activityFixtures = {
  limitsChange: {
    id: "act-1",
    action: "UPDATED",
    entityType: "WORKSPACE",
    entityId: "ws-1",
    createdAt: new Date().toISOString(),
    metadata: {
      source: "focura-admin",
      changes: {
        aiDailyCalls:      { from: null, to: 9000 },
        aiMonthlyTokens:   { from: 500000, to: 100_000_000 },
        aiMaxOutputTokens: { from: null, to: 8192 },
        plan:              { from: "PRO", to: "ENTERPRISE" },
      },
    },
    user: { id: "u1", name: "Focura Admin", email: "admin@focura.app", image: null },
    workspace: { id: "ws-1", name: "Acme Inc", slug: "acme" },
  },
  plain: {
    id: "act-2",
    action: "CREATED",
    entityType: "TASK",
    entityId: "task-1",
    createdAt: new Date().toISOString(),
    metadata: null,
    user: { id: "u2", name: "Jane Doe", email: "jane@example.com", image: null },
    workspace: null,
  },
};

// ═════════════════════════════════════════════════════════════════════════════

describe("AdminActivityPage", () => {
  it("renders AI cap changes as before → after chips attributed to the admin", async () => {
    const useAdmin = await import("@/hooks/useAdmin");
    vi.mocked(useAdmin.useAdminActivity).mockReturnValue({
      data: {
        data: [activityFixtures.limitsChange],
        pagination: { totalCount: 1, totalPages: 1 },
      },
      isLoading: false,
    } as never);

    // The server page (activity/page.tsx) prefetches and hydrates; the
    // rendered behavior under test lives in AdminActivityContent.
    const { AdminActivityContent } = await import(
      "@/components/admin-dashboard/AdminActivityContent"
    );
    render(<AdminActivityContent />);

    // Who — the acting admin
    expect(screen.getByText("Focura Admin")).toBeInTheDocument();
    expect(screen.getByText("admin@focura.app")).toBeInTheDocument();
    // The workspace link
    expect(screen.getByText("Acme Inc")).toBeInTheDocument();

    // Which caps — formatted before → after
    expect(screen.getByText(/9,000/)).toBeInTheDocument();
    expect(screen.getByText(/500,000/)).toBeInTheDocument();
    expect(screen.getByText(/100M/)).toBeInTheDocument();
    expect(screen.getByText(/8,192/)).toBeInTheDocument();
    // Plan change too
    expect(screen.getByText(/ENTERPRISE/)).toBeInTheDocument();
    // Two chips should show "default" (null → value)
    expect(screen.getAllByText(/default/).length).toBeGreaterThan(0);
  });

  it("renders rows without limit metadata without a change summary", async () => {
    const useAdmin = await import("@/hooks/useAdmin");
    vi.mocked(useAdmin.useAdminActivity).mockReturnValue({
      data: {
        data: [activityFixtures.plain],
        pagination: { totalCount: 1, totalPages: 1 },
      },
      isLoading: false,
    } as never);

    const { AdminActivityContent } = await import(
      "@/components/admin-dashboard/AdminActivityContent"
    );
    render(<AdminActivityContent />);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("CREATED")).toBeInTheDocument();
    expect(screen.queryByText(/→/)).not.toBeInTheDocument();
  });
});
