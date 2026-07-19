import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GeneralSettingsTab } from "@/components/Dashboard/Workspaces/WorkspaceSettings/GeneralSettingsTab";

vi.mock("framer-motion", () => ({
  motion: {
    div: (props: any) => <div {...props} />,
  },
}));

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: any) => <svg data-testid={`icon-${name}`} {...props} />;
    C.displayName = name;
    return C;
  };
  return { Save: icon("Save"), Loader2: icon("Loader2") };
});

vi.mock("@/hooks/useWorkspaceSettings", () => ({
  PREDEFINED_COLORS: ["#3b82f6", "#ef4444", "#10b981"],
}));

const defaultProps = {
  formData: { name: "My Workspace", description: "Desc", color: "#3b82f6", isPublic: false, allowInvites: true },
  errors: {},
  isAdmin: true,
  isUpdating: false,
  onUpdateField: vi.fn(),
  onSave: vi.fn(),
};

describe("GeneralSettingsTab", () => {
  it("renders workspace name and description fields", () => {
    render(<GeneralSettingsTab {...defaultProps} />);
    expect(screen.getByDisplayValue("My Workspace")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Desc")).toBeInTheDocument();
  });

  it("renders save button for admins", () => {
    render(<GeneralSettingsTab {...defaultProps} />);
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  it("hides save button for non-admins", () => {
    render(<GeneralSettingsTab {...defaultProps} isAdmin={false} />);
    expect(screen.queryByText("Save Changes")).not.toBeInTheDocument();
  });

  it("shows validation errors", () => {
    render(<GeneralSettingsTab {...defaultProps} errors={{ name: "Required" }} />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});
