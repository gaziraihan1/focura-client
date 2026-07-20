import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("lucide-react", () => ({
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-X" {...props} />,
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-Loader2" {...props} />,
}));

vi.mock("@/hooks/useAdmin", () => ({
  useUpdateWorkspaceLimits: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@/lib/utils", () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(" "),
}));

import { EditWorkspaceLimitsModal } from "@/components/AdminDashboard/Workspace/EditWorkspaceLimitsModal";

describe("EditWorkspaceLimitsModal", () => {
  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <EditWorkspaceLimitsModal
        workspaceSlug="ws-1"
        workspaceName="My Workspace"
        currentPlan="PRO"
        currentMaxMembers={10}
        currentMaxStorage={5000}
        isOpen={false}
        onClose={vi.fn()}
      />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders modal when isOpen is true", () => {
    render(
      <EditWorkspaceLimitsModal
        workspaceSlug="ws-1"
        workspaceName="My Workspace"
        currentPlan="PRO"
        currentMaxMembers={10}
        currentMaxStorage={5000}
        isOpen={true}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText("Edit Limits — My Workspace")).toBeInTheDocument();
  });

  it("renders plan select options", () => {
    render(
      <EditWorkspaceLimitsModal
        workspaceSlug="ws-1"
        workspaceName="Test WS"
        currentPlan="FREE"
        currentMaxMembers={5}
        currentMaxStorage={1024}
        isOpen={true}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText("FREE")).toBeInTheDocument();
    expect(screen.getByText("PRO")).toBeInTheDocument();
  });
});
