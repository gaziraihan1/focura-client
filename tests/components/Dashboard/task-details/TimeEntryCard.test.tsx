import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// ─── Mocks ─────────────────────────────────────────────────────────────────

const mockEntries = [
  {
    id: "entry-1",
    taskId: "task-1",
    userId: "user-1",
    duration: 30,
    category: "DEEP_WORK",
    billable: true,
    description: "Focused work",
    startedAt: "2024-06-01T10:00:00.000Z",
    endedAt: null,
    user: { id: "user-1", name: "Alice", email: "alice@test.com" },
  },
  {
    id: "entry-2",
    taskId: "task-1",
    userId: "user-2",
    duration: 60,
    category: "MEETINGS",
    billable: false,
    description: null,
    startedAt: "2024-06-02T10:00:00.000Z",
    endedAt: null,
    user: { id: "user-2", name: "Bob", email: "bob@test.com" },
  },
];

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "user-1", name: "Alice" } },
    status: "authenticated",
  }),
}));

const mockAdd = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock("@/hooks/useTimeEntries", () => ({
  useTaskTimeEntries: () => ({ data: mockEntries, isLoading: false }),
  useAddTimeEntry: () => ({ mutate: mockAdd, isPending: false }),
  useUpdateTimeEntry: () => ({ mutate: mockUpdate, isPending: false }),
  useDeleteTimeEntry: () => ({ mutate: mockDelete, isPending: false }),
}));

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid={`${name}-icon`} {...props} />
    );
    Component.displayName = name;
    return Component;
  };
  return {
    Clock: icon("Clock"),
    Plus: icon("Plus"),
    Trash2: icon("Trash2"),
    Pencil: icon("Pencil"),
    Check: icon("Check"),
    X: icon("X"),
    Briefcase: icon("Briefcase"),
    ChevronDown: icon("ChevronDown"),
    ChevronUp: icon("ChevronUp"),
  };
});

import { TimeEntryCard } from "@/components/dashboard/task-details/TimeEntryCard";

describe("TimeEntryCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders entries with durations and total", () => {
    render(<TimeEntryCard taskId="task-1" />);

    // The total should be visible even when collapsed
    expect(screen.getByText("1h 30m")).toBeInTheDocument(); // total

    // Expand the section to see the entries
    fireEvent.click(screen.getByLabelText(/expand time entries/i));

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("30m")).toBeInTheDocument();
    expect(screen.getByText("1h")).toBeInTheDocument();
  });

  it("shows an edit button only for the current user's entries", () => {
    render(<TimeEntryCard taskId="task-1" />);

    // Expand the section to see the entries
    fireEvent.click(screen.getByLabelText(/expand time entries/i));

    expect(screen.getAllByTitle("Edit entry")).toHaveLength(1);
  });

  it("opens the inline edit form pre-filled with the entry's values", () => {
    render(<TimeEntryCard taskId="task-1" />);

    // Expand the section to see the entries
    fireEvent.click(screen.getByLabelText(/expand time entries/i));

    fireEvent.click(screen.getByTitle("Edit entry"));

    expect(screen.getByDisplayValue("30")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Focused work")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("saves changes through the update hook", () => {
    mockUpdate.mockImplementation((_input: unknown, opts: { onSuccess?: () => void }) => {
      opts.onSuccess?.();
    });

    render(<TimeEntryCard taskId="task-1" />);

    // Expand the section to see the entries
    fireEvent.click(screen.getByLabelText(/expand time entries/i));

    fireEvent.click(screen.getByTitle("Edit entry"));
    fireEvent.change(screen.getByDisplayValue("30"), { target: { value: "45" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "entry-1",
        taskId: "task-1",
        duration: 45,
        category: "DEEP_WORK",
        billable: true,
        description: "Focused work",
      }),
      expect.anything()
    );
  });

  it("passes workspaceId when updating so analytics refresh", () => {
    mockUpdate.mockImplementation((_input: unknown, opts: { onSuccess?: () => void }) => {
      opts.onSuccess?.();
    });

    render(<TimeEntryCard taskId="task-1" workspaceId="ws-1" />);

    // Expand the section to see the entries
    fireEvent.click(screen.getByLabelText(/expand time entries/i));

    fireEvent.click(screen.getByTitle("Edit entry"));
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ workspaceId: "ws-1" }),
      expect.anything()
    );
  });

  it("passes workspaceId and backdates when adding an entry", () => {
    mockAdd.mockImplementation((_input: unknown, opts: { onSuccess?: () => void }) => {
      opts.onSuccess?.();
    });

    render(<TimeEntryCard taskId="task-1" workspaceId="ws-1" />);

    // Expand the section to see the add form
    fireEvent.click(screen.getByLabelText(/expand time entries/i));

    fireEvent.change(screen.getByLabelText("Entry date"), { target: { value: "2026-08-01" } });
    fireEvent.change(screen.getByPlaceholderText("30"), { target: { value: "45" } });
    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

    const payload = mockAdd.mock.calls[0][0] as {
      workspaceId: string;
      startedAt: string;
    };
    expect(payload.workspaceId).toBe("ws-1");
    // startedAt round-trips to the picked local date regardless of timezone.
    expect(new Date(payload.startedAt).toLocaleDateString("en-CA")).toBe("2026-08-01");
  });

  it("closes the form after a successful save", () => {
    mockUpdate.mockImplementation((_input: unknown, opts: { onSuccess?: () => void }) => {
      opts.onSuccess?.();
    });

    render(<TimeEntryCard taskId="task-1" />);

    // Expand the section to see the entries
    fireEvent.click(screen.getByLabelText(/expand time entries/i));

    fireEvent.click(screen.getByTitle("Edit entry"));
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.queryByRole("button", { name: /save/i })).not.toBeInTheDocument();
    expect(screen.getByTitle("Edit entry")).toBeInTheDocument();
  });

  it("cancels editing without updating", () => {
    render(<TimeEntryCard taskId="task-1" />);

    // Expand the section to see the entries
    fireEvent.click(screen.getByLabelText(/expand time entries/i));

    fireEvent.click(screen.getByTitle("Edit entry"));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: /save/i })).not.toBeInTheDocument();
  });
});
