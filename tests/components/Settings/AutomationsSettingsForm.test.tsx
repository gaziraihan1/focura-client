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
