/**
 * tests/components/Settings/AutomationsSettingsForm.test.tsx
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AutomationsSettingsForm } from "@/components/Settings/AutomationsSettingsForm";

// Mock lucide-react
vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid={`icon-${name}`} {...props} />
    );
    C.displayName = name;
    return C;
  };
  return {
    Zap: icon("Zap"),
    Plus: icon("Plus"),
    Loader2: icon("Loader2"),
    Pencil: icon("Pencil"),
    Trash2: icon("Trash2"),
    Calendar: icon("Calendar"),
    Play: icon("Play"),
    Folder: icon("Folder"),
  };
});

// Mock hooks
const mockRules = [
  {
    id: "rule-1",
    workspaceId: "ws-1",
    projectId: null,
    name: "Auto-assign on review",
    triggerType: "STATUS_CHANGED",
    triggerConfig: { fromStatus: "IN_PROGRESS", toStatus: "IN_REVIEW" },
    actions: [{ type: "ASSIGN_USER", config: { role: "project-owner" } }],
    enabled: true,
    runCount: 3,
    lastRunAt: "2026-08-01T09:00:00.000Z",
    createdById: "user-1",
    createdAt: "2026-07-01T09:00:00.000Z",
    updatedAt: "2026-07-01T09:00:00.000Z",
  },
];

const mockMembers = [
  {
    userId: "user-1",
    role: "ADMIN",
    user: { id: "user-1", name: "Alice", email: "alice@test.com" },
  },
  {
    userId: "user-2",
    role: "MEMBER",
    user: { id: "user-2", name: "Bob", email: "bob@test.com" },
  },
];

const mockLabels = [
  { id: "label-1", name: "Urgent", color: "#ef4444" },
  { id: "label-2", name: "Bug", color: "#3b82f6" },
];

vi.mock("@/hooks/useWorkspaceQueries", () => ({
  useWorkspaces: vi.fn(() => ({
    data: [
      {
        id: "ws-1",
        name: "Test Workspace",
        slug: "test-ws",
        plan: "PRO",
        ownerId: "user-1",
      },
    ],
    isLoading: false,
  })),
  useWorkspaceMembers: vi.fn(() => ({ data: [], isLoading: false })),
}));

vi.mock("@/hooks/useAutomations", () => ({
  useAutomations: vi.fn(() => ({ data: mockRules, isLoading: false })),
  useAutomationRuns: vi.fn(() => ({ data: [], isLoading: false })),
  useCreateAutomation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useUpdateAutomation: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useDeleteAutomation: vi.fn(() => ({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  })),
  useTestAutomation: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  automationKeys: { all: ["automations"] },
}));

vi.mock("@/hooks/useProjectQueries", () => ({
  useProjects: vi.fn(() => ({ data: [], isLoading: false })),
}));

vi.mock("@/hooks/useLabels", () => ({
  useLabels: vi.fn(() => ({
    data: {
      success: true,
      data: mockLabels,
      pagination: {
        page: 1,
        limit: 100,
        total: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    },
    isLoading: false,
  })),
}));

vi.mock("@/components/Shared/ConfirmModal", () => ({
  ConfirmModal: ({ isOpen, onConfirm, title }: any) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <span>{title}</span>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null,
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import { useAutomations, useUpdateAutomation, useDeleteAutomation } from "@/hooks/useAutomations";
import { useWorkspaceMembers, useWorkspaces } from "@/hooks/useWorkspaceQueries";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe("AutomationsSettingsForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Restore default mock returns — clearAllMocks does not reset
    // implementations set via mockReturnValue in earlier tests.
    vi.mocked(useAutomations).mockReturnValue({ data: mockRules, isLoading: false } as any);
    vi.mocked(useUpdateAutomation).mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);
    vi.mocked(useDeleteAutomation).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    } as any);
    vi.mocked(useWorkspaceMembers).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(useWorkspaces).mockReturnValue({
      data: [{ id: "ws-1", name: "Test Workspace", slug: "test-ws", plan: "PRO", ownerId: "user-1" }],
      isLoading: false,
    } as any);
  });

  it("renders the workspace picker and the rules list", () => {
    render(<AutomationsSettingsForm />, { wrapper: createWrapper() });

    expect(screen.getByText("Automations")).toBeInTheDocument();
    expect(screen.getByText("Auto-assign on review")).toBeInTheDocument();
    expect(screen.getByText("Test Workspace")).toBeInTheDocument();
  });

  it("shows an empty state when there are no rules", () => {
    vi.mocked(useAutomations).mockReturnValue({ data: [], isLoading: false } as any);

    render(<AutomationsSettingsForm />, { wrapper: createWrapper() });

    expect(screen.getByText("No automation rules yet")).toBeInTheDocument();
  });

  it("opens the rule builder when New rule is clicked", async () => {
    const user = userEvent.setup();
    render(<AutomationsSettingsForm />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /New rule/i }));

    expect(screen.getByLabelText("Rule name")).toBeInTheDocument();
    expect(screen.getByLabelText("Trigger")).toBeInTheDocument();
  });

  it("offers the due-date-approaching trigger and its days input", async () => {
    const user = userEvent.setup();
    render(<AutomationsSettingsForm />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /New rule/i }));

    const trigger = screen.getByLabelText("Trigger");
    expect(trigger).toHaveDisplayValue("When a task status changes");

    await user.selectOptions(trigger, "DUE_DATE_APPROACHING");

    expect(screen.getByLabelText(/Fire when due within/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fire when due within/)).toHaveValue(3);
  });

  it("offers the assignee-changed trigger with an optional member filter", async () => {
    vi.mocked(useWorkspaceMembers).mockReturnValue({
      data: mockMembers,
      isLoading: false,
    } as any);

    const user = userEvent.setup();
    render(<AutomationsSettingsForm />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /New rule/i }));

    const trigger = screen.getByLabelText("Trigger");
    await user.selectOptions(trigger, "ASSIGNEE_CHANGED");

    const filter = screen.getByLabelText(/Assigned member/);
    expect(filter).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("offers the label-added trigger with an optional label filter", async () => {
    const user = userEvent.setup();
    render(<AutomationsSettingsForm />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /New rule/i }));

    const trigger = screen.getByLabelText("Trigger");
    await user.selectOptions(trigger, "LABEL_ADDED");

    const filter = screen.getByLabelText(/Label \(optional\)/);
    expect(filter).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
    expect(screen.getByText("Bug")).toBeInTheDocument();
  });

  it("offers the mention trigger with an optional member filter", async () => {
    vi.mocked(useWorkspaceMembers).mockReturnValue({
      data: mockMembers,
      isLoading: false,
    } as any);

    const user = userEvent.setup();
    render(<AutomationsSettingsForm />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /New rule/i }));

    const trigger = screen.getByLabelText("Trigger");
    await user.selectOptions(trigger, "MENTION");

    const filter = screen.getByLabelText(/Mentioned member/);
    expect(filter).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("shows the due-date window description for a DUE_DATE_APPROACHING rule", async () => {
    vi.mocked(useAutomations).mockReturnValue({
      data: [
        {
          id: "rule-2",
          workspaceId: "ws-1",
          projectId: null,
          name: "Warn before due dates",
          triggerType: "DUE_DATE_APPROACHING",
          triggerConfig: { daysBefore: 5 },
          actions: [{ type: "NOTIFY_MEMBERS", config: { message: "Due soon" } }],
          enabled: true,
          runCount: 1,
          lastRunAt: "2026-08-02T09:00:00.000Z",
          createdById: "user-1",
          createdAt: "2026-07-01T09:00:00.000Z",
          updatedAt: "2026-07-01T09:00:00.000Z",
        },
      ],
      isLoading: false,
    } as any);

    render(<AutomationsSettingsForm />, { wrapper: createWrapper() });

    expect(screen.getByText("Warn before due dates")).toBeInTheDocument();
    expect(screen.getByText("Task due date is approaching")).toBeInTheDocument();
    expect(screen.getByText(/due within 5 days/)).toBeInTheDocument();
  });

  it("shows the assignee-changed description with the member name", async () => {
    vi.mocked(useWorkspaceMembers).mockReturnValue({
      data: mockMembers,
      isLoading: false,
    } as any);
    vi.mocked(useAutomations).mockReturnValue({
      data: [
        {
          id: "rule-3",
          workspaceId: "ws-1",
          projectId: null,
          name: "Notify on assignment",
          triggerType: "ASSIGNEE_CHANGED",
          triggerConfig: { assigneeUserId: "user-2" },
          actions: [{ type: "NOTIFY_MEMBERS", config: { message: "Welcome" } }],
          enabled: true,
          runCount: 0,
          lastRunAt: null,
          createdById: "user-1",
          createdAt: "2026-07-01T09:00:00.000Z",
          updatedAt: "2026-07-01T09:00:00.000Z",
        },
      ],
      isLoading: false,
    } as any);

    render(<AutomationsSettingsForm />, { wrapper: createWrapper() });

    expect(screen.getByText("Someone is assigned to a task")).toBeInTheDocument();
    expect(screen.getByText(/when Bob is assigned/)).toBeInTheDocument();
  });

  it("shows the label-added description with the label name", async () => {
    vi.mocked(useAutomations).mockReturnValue({
      data: [
        {
          id: "rule-4",
          workspaceId: "ws-1",
          projectId: null,
          name: "Escalate bug labels",
          triggerType: "LABEL_ADDED",
          triggerConfig: { labelId: "label-2" },
          actions: [{ type: "SET_PRIORITY", config: { priority: "HIGH" } }],
          enabled: true,
          runCount: 0,
          lastRunAt: null,
          createdById: "user-1",
          createdAt: "2026-07-01T09:00:00.000Z",
          updatedAt: "2026-07-01T09:00:00.000Z",
        },
      ],
      isLoading: false,
    } as any);

    render(<AutomationsSettingsForm />, { wrapper: createWrapper() });

    expect(screen.getByText("A label is added to a task")).toBeInTheDocument();
    expect(screen.getByText(/when Bug is added/)).toBeInTheDocument();
  });

  it("shows the mention description with the member name", async () => {
    vi.mocked(useWorkspaceMembers).mockReturnValue({
      data: mockMembers,
      isLoading: false,
    } as any);
    vi.mocked(useAutomations).mockReturnValue({
      data: [
        {
          id: "rule-5",
          workspaceId: "ws-1",
          projectId: null,
          name: "Mention alert",
          triggerType: "MENTION",
          triggerConfig: { mentionedUserId: "user-1" },
          actions: [{ type: "NOTIFY_MEMBERS", config: { message: "Heads up" } }],
          enabled: true,
          runCount: 0,
          lastRunAt: null,
          createdById: "user-1",
          createdAt: "2026-07-01T09:00:00.000Z",
          updatedAt: "2026-07-01T09:00:00.000Z",
        },
      ],
      isLoading: false,
    } as any);

    render(<AutomationsSettingsForm />, { wrapper: createWrapper() });

    expect(screen.getByText("A member is mentioned in a comment")).toBeInTheDocument();
    expect(screen.getByText(/when Alice is mentioned/)).toBeInTheDocument();
  });

  it("toggles a rule enabled state", async () => {
    const user = userEvent.setup();
    const mockUpdate = vi.fn();
    vi.mocked(useUpdateAutomation).mockReturnValue({
      mutate: mockUpdate,
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    render(<AutomationsSettingsForm />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("switch"));

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ id: "rule-1", enabled: false }),
      expect.anything(),
    );
  });

  it("asks for confirmation before deleting a rule", async () => {
    const user = userEvent.setup();
    const mockDelete = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDeleteAutomation).mockReturnValue({
      mutateAsync: mockDelete,
      isPending: false,
    } as any);

    render(<AutomationsSettingsForm />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /Delete Auto-assign on review/i }));
    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

    await user.click(screen.getByText("Confirm"));
    await waitFor(() => expect(mockDelete).toHaveBeenCalledWith("rule-1"));
  });
});
