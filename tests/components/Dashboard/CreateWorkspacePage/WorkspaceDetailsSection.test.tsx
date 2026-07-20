import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkspaceDetailsSection } from "@/components/Dashboard/CreateWorkspacePage/WorkspaceDetailsSection";

vi.mock("framer-motion", () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
  },
}));

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />;
    C.displayName = name;
    return C;
  };
  return { AlertCircle: icon("AlertCircle") };
});

const defaultProps = {
  name: "",
  description: "",
  color: "#3b82f6",
  isPublic: false,
  colors: ["#3b82f6", "#ef4444", "#10b981"],
  errors: {},
  onNameChange: vi.fn(),
  onDescriptionChange: vi.fn(),
  onColorChange: vi.fn(),
  onPublicChange: vi.fn(),
};

describe("WorkspaceDetailsSection", () => {
  it("renders name and description inputs", () => {
    render(<WorkspaceDetailsSection {...defaultProps} />);
    expect(screen.getByPlaceholderText(/Acme Inc/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/this workspace about/)).toBeInTheDocument();
  });

  it("renders color picker buttons", () => {
    render(<WorkspaceDetailsSection {...defaultProps} />);
    const colorButtons = screen.getAllByRole("button").filter(
      (btn) => btn.getAttribute("style")?.includes("background-color")
    );
    expect(colorButtons.length).toBe(3);
  });

  it("shows validation error for name", () => {
    render(<WorkspaceDetailsSection {...defaultProps} errors={{ name: "Name required" }} />);
    expect(screen.getByText("Name required")).toBeInTheDocument();
  });

  it("renders public checkbox", () => {
    render(<WorkspaceDetailsSection {...defaultProps} />);
    expect(screen.getByText("Make workspace public")).toBeInTheDocument();
  });
});
