import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccessDeniedProject } from "@/components/Dashboard/ProjectDetails/AccessDeniedProject";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  }),
}));

describe("AccessDeniedProject", () => {
  it("renders the access denied heading", () => {
    render(<AccessDeniedProject />);
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
  });

  it("renders the default message", () => {
    render(<AccessDeniedProject />);
    expect(screen.getByText(/You don't have permission to view this project/)).toBeInTheDocument();
  });

  it("renders the project name when provided", () => {
    render(<AccessDeniedProject projectName="My Project" />);
    expect(screen.getByText("Project:")).toBeInTheDocument();
    expect(screen.getByText("My Project")).toBeInTheDocument();
  });

  it("renders the workspace name when provided", () => {
    render(<AccessDeniedProject workspaceName="My Workspace" />);
    expect(screen.getByText("Workspace:")).toBeInTheDocument();
    expect(screen.getByText("My Workspace")).toBeInTheDocument();
  });

  it("renders both project and workspace names", () => {
    render(<AccessDeniedProject projectName="Proj" workspaceName="Ws" />);
    expect(screen.getByText("Proj")).toBeInTheDocument();
    expect(screen.getByText("Ws")).toBeInTheDocument();
  });

  it("hides project/workspace info when not provided", () => {
    render(<AccessDeniedProject />);
    expect(screen.queryByText("Project:")).toBeNull();
    expect(screen.queryByText("Workspace:")).toBeNull();
  });

  it("renders the info card with contact message", () => {
    render(<AccessDeniedProject />);
    expect(screen.getByText(/contact the project owner or workspace administrator/)).toBeInTheDocument();
  });

  it("renders the Go Back button", () => {
    render(<AccessDeniedProject />);
    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it("renders the Go to Dashboard button", () => {
    render(<AccessDeniedProject />);
    expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
  });

  it("renders the Contact Support link", () => {
    render(<AccessDeniedProject />);
    expect(screen.getByText("Contact Support")).toBeInTheDocument();
  });
});
