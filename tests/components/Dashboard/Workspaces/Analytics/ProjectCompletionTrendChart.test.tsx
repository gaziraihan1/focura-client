import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// ─── Global Mocks ────────────────────────────────────────────────────────────
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, alt = "", ...rest } = props;
    return <img alt={alt} {...rest} data-fill={fill} />;
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />;
    C.displayName = name;
    return C;
  };
  return {
    AlertTriangle: icon("AlertTriangle"),
    AlertCircle: icon("AlertCircle"),
    ArrowRight: icon("ArrowRight"),
    Award: icon("Award"),
    BarChart3: icon("BarChart3"),
    Calendar: icon("Calendar"),
    CalendarClock: icon("CalendarClock"),
    Camera: icon("Camera"),
    Check: icon("Check"),
    CheckCircle2: icon("CheckCircle2"),
    ChevronDown: icon("ChevronDown"),
    ChevronLeft: icon("ChevronLeft"),
    ChevronRight: icon("ChevronRight"),
    Clock: icon("Clock"),
    Command: icon("Command"),
    Copy: icon("Copy"),
    Crown: icon("Crown"),
    Eye: icon("Eye"),
    EyeOff: icon("EyeOff"),
    File: icon("File"),
    Flag: icon("Flag"),
    Flame: icon("Flame"),
    Folder: icon("Folder"),
    Globe: icon("Globe"),
    Gauge: icon("Gauge"),
    Grid: icon("Grid"),
    HardDrive: icon("HardDrive"),
    Hash: icon("Hash"),
    Info: icon("Info"),
    LayoutGrid: icon("LayoutGrid"),
    Link: icon("Link"),
    Loader2: icon("Loader2"),
    Lock: icon("Lock"),
    LogOut: icon("LogOut"),
    Mail: icon("Mail"),
    Menu: icon("Menu"),
    MessageCircle: icon("MessageCircle"),
    MessageSquare: icon("MessageSquare"),
    Megaphone: icon("Megaphone"),
    Minus: icon("Minus"),
    MoreHorizontal: icon("MoreHorizontal"),
    Pen: icon("Pen"),
    Pencil: icon("Pencil"),
    Pin: icon("Pin"),
    PinOff: icon("PinOff"),
    Plus: icon("Plus"),
    Radio: icon("Radio"),
    RefreshCw: icon("RefreshCw"),
    Save: icon("Save"),
    Search: icon("Search"),
    Send: icon("Send"),
    Settings: icon("Settings"),
    Shield: icon("Shield"),
    ShieldAlert: icon("ShieldAlert"),
    Sparkles: icon("Sparkles"),
    Tag: icon("Tag"),
    Timer: icon("Timer"),
    Trash2: icon("Trash2"),
    TrendingDown: icon("TrendingDown"),
    TrendingUp: icon("TrendingUp"),
    User: icon("User"),
    Users: icon("Users"),
    Wifi: icon("Wifi"),
    Zap: icon("Zap"),
    X: icon("X"),
    XCircle: icon("XCircle"),
  };
});

vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("@/lib/apiData", () => ({
  API_SECTIONS: [
    {
      id: "workspace-endpoints",
      title: "Workspaces",
      description: "Manage workspaces",
      endpoints: [
        {
          id: "list-workspaces",
          method: "GET",
          path: "/api/v1/workspaces",
          summary: "List all workspaces",
          description: "Returns all workspaces",
          auth: "auth" as const,
          responses: [{ status: 200, description: "Success", shape: [{ name: "data", type: "array", description: "Workspaces" }] }],
          examples: [{ label: "cURL", code: "curl /api/v1/workspaces" }],
        },
        {
          id: "create-workspace",
          method: "POST",
          path: "/api/v1/workspaces",
          summary: "Create a workspace",
          description: "Create a new workspace",
          auth: "auth" as const,
          bodyFields: [{ name: "name", type: "string", required: true, description: "Workspace name", example: "My Workspace" }],
          responses: [{ status: 201, description: "Created" }],
          examples: [{ label: "cURL", code: "curl -X POST" }],
          deprecated: true,
        },
      ],
    },
    {
      id: "public-endpoints",
      title: "Public",
      description: "Public endpoints",
      endpoints: [
        {
          id: "health-check",
          method: "GET",
          path: "/api/v1/health",
          summary: "Health check",
          description: "Returns health status",
          auth: "public" as const,
          responses: [{ status: 200, description: "OK" }],
          examples: [{ label: "cURL", code: "curl /api/v1/health" }],
        },
      ],
    },
  ],
  FULL_BASE: "https://api.focura.app/api/v1",
  API_VERSION: "v1",
  METHOD_COLORS: { GET: "bg-blue-100 text-blue-700", POST: "bg-green-100 text-green-700", PUT: "bg-amber-100 text-amber-700", PATCH: "bg-violet-100 text-violet-700", DELETE: "bg-red-100 text-red-700" },
  METHOD_DOT: { GET: "bg-blue-500", POST: "bg-green-500", PUT: "bg-amber-500", PATCH: "bg-violet-500", DELETE: "bg-red-500" },
  AUTH_BADGE: {
    public: { label: "Public", style: "bg-neutral-100 text-neutral-600" },
    auth: { label: "Auth", style: "bg-blue-100 text-blue-700" },
    admin: { label: "Admin", style: "bg-red-100 text-red-700" },
  },
}));

vi.mock("@/lib/task/time", () => ({
  getTaskTimeInfo: () => ({ isOverdue: false, hoursUntilDue: 48 }),
}));

vi.mock("@/utils/taskcard.utils", () => ({
  calculateTimeProgress: () => 50,
}));

vi.mock("@/utils/task.utils", () => ({
  getStatusColor: () => "bg-blue-100 text-blue-700",
  getPriorityColor: () => "text-amber-500",
  formatHoursSinceCreation: () => "2h",
  formatTimeDuration: (h: number) => `${h}h left`,
}));

vi.mock("@/utils/meetingDetails.utils", () => ({
  avatarColor: () => "bg-primary/10 text-primary",
  getInitials: (name: string) => name?.charAt(0)?.toUpperCase() ?? "U",
  formatTime: () => "10:00 AM",
}));

vi.mock("@/utils/analytics.utils", () => ({
  getRelativeTime: () => "in 3 days",
}));

vi.mock("@/types/meeting.types", () => ({}));
vi.mock("@/types/task.types", () => ({
  TaskPriority: {},
  TaskStatus: {},
}));
vi.mock("@/types/job.types", () => ({
  DEPARTMENT_LABELS: { ENGINEERING: "Engineering" },
  TYPE_LABELS: { FULL_TIME: "Full-time" },
  JobPosting: {},
}));
vi.mock("@/types/admin.types", () => ({}));
vi.mock("@/types/resource.types", () => ({}));

vi.mock("@/types/announcement.types", () => ({}));

vi.mock("@/hooks/useAdmin", () => ({
  useBanUser: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteWorkspace: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdateWorkspaceLimits: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@/hooks/useResource", () => ({
  useCreateProductUpdate: () => ({ mutateAsync: vi.fn(), isPending: false, error: null }),
  useUpdateProductUpdate: () => ({ mutateAsync: vi.fn(), isPending: false, error: null }),
  useCreatePopularResource: () => ({ mutateAsync: vi.fn(), isPending: false, error: null }),
  useUpdatePopularResource: () => ({ mutateAsync: vi.fn(), isPending: false, error: null }),
  useAdminProductUpdates: () => ({ data: { data: { items: [], total: 0, totalPages: 0 } }, isLoading: false, isPlaceholderData: false }),
  useAdminPopularResources: () => ({ data: { data: { items: [], total: 0, totalPages: 0 } }, isLoading: false, isPlaceholderData: false }),
  useDeleteProductUpdate: () => ({ mutate: vi.fn(), variables: null, isPending: false }),
  useDeletePopularResource: () => ({ mutate: vi.fn(), variables: null, isPending: false }),
}));

vi.mock("@/hooks/useJob", () => ({
  useAdminJobs: () => ({ data: { jobs: [] }, isPending: false, isError: false, refetch: vi.fn() }),
  useCreateJob: () => ({ mutateAsync: vi.fn() }),
  useUpdateJob: () => ({ mutateAsync: vi.fn() }),
  useDeleteJob: () => ({ mutateAsync: vi.fn() }),
  useToggleJobPin: () => ({ mutate: vi.fn() }),
  useToggleJobStatus: () => ({ mutate: vi.fn() }),
}));

vi.mock("@/hooks/useContactMessage", () => ({}));

vi.mock("@/app/(dashboard-pages)/admin-dashboard/contact/page", () => ({
  formatCategory: (c: string) => c,
  formatDate: (d: string) => new Date(d).toLocaleDateString(),
}));

vi.mock("@/hooks/useProjectAnalytics", () => ({}));
vi.mock("@/hooks/useProjectAnalyticsPage", () => ({
  useProjectAnalyticsPage: () => ({
    overview: {
      kpis: {
        totalTasks: 20,
        completedTasks: 10,
        inProgressTasks: 5,
        overdueTasks: 2,
        totalMembers: 4,
        totalHours: 100,
        storageUsed: 1073741824,
        completionRate: 50,
      },
      taskStatus: [{ status: "TODO", count: 10 }],
      priority: [{ priority: "HIGH", count: 5 }],
    },
    overviewLoading: false,
    overviewError: false,
    isAccessDenied: false,
    errorMessage: "",
    completionTrend: [{ date: new Date("2026-07-01"), count: 5 }, { date: new Date("2026-07-15"), count: 10 }],
    memberContribution: [{ userId: "1", userName: "Alice", userEmail: "a@b.com", role: "ADMIN", completedTasks: 5, totalHours: 20, commentsCount: 10, contributionScore: 100 }],
    deadlineRisk: {
      riskLevel: "medium" as const,
      dueIn3DaysCount: 3,
      dueIn7DaysCount: 5,
      highPriorityNearDeadline: [
        { id: "1", title: "Urgent task", priority: "URGENT", dueDate: "2026-07-20" },
        { id: "2", title: "High task", priority: "HIGH", dueDate: "2026-07-22" },
      ],
    },
    isLoading: false,
  }),
}));

vi.mock("@/hooks/useWorkspace", () => ({}));

vi.mock("@/components/Themes/ThemeSwitcher", () => ({
  default: () => <div data-testid="theme-switcher" />,
}));

vi.mock("@/components/Shared/Pagination", () => ({
  Pagination: ({ currentPage, totalPages, onPageChange }: Record<string, unknown>) => (
    <div data-testid="pagination">
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

vi.mock("@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/announcements/page", () => ({
  formatFullDate: (d: string) => new Date(d).toLocaleString(),
  timeAgo: () => "2 hours ago",
  initials: (n?: string) => n?.charAt(0)?.toUpperCase() ?? "?",
}));

// ═══════════════════════════════════════════════════════════════════════════════
// API DOCS
// ═══════════════════════════════════════════════════════════════════════════════

describe("ProjectCompletionTrendChart", () => {
  it("renders chart with data", async () => {
    const { ProjectCompletionTrendChart } = await import("@/components/Dashboard/Workspaces/project/Analytics/ProjectCompletionTrend");
    render(
      <ProjectCompletionTrendChart
        data={[
          { date: new Date("2026-07-01"), count: 5 },
          { date: new Date("2026-07-15"), count: 10 },
        ]}
      />
    );
    expect(screen.getByText("Completion Trend")).toBeInTheDocument();
    expect(screen.getByText("+100%")).toBeInTheDocument();
  });

  it("renders empty state", async () => {
    const { ProjectCompletionTrendChart } = await import("@/components/Dashboard/Workspaces/project/Analytics/ProjectCompletionTrend");
    render(<ProjectCompletionTrendChart data={[]} />);
    expect(screen.getByText("No completion data available")).toBeInTheDocument();
  });
});
