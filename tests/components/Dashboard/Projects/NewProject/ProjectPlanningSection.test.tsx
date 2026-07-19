import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectPlanningSection } from "@/components/Dashboard/Projects/NewProject/ProjectPlanningSection";

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
  return { AlertCircle: icon("AlertCircle"), Calendar: icon("Calendar"), Flag: icon("Flag") };
});

vi.mock("@/hooks/useProjects", () => ({
  CreateProjectDto: {},
}));

const defaultProps = {
  form: { priority: "MEDIUM" as const, startDate: "", dueDate: "" },
  errors: {},
  onFieldChange: vi.fn(),
};

describe("ProjectPlanningSection", () => {
  it("renders the planning heading", () => {
    render(<ProjectPlanningSection {...defaultProps} />);
    expect(screen.getByText("Planning")).toBeInTheDocument();
  });

  it("renders priority buttons", () => {
    render(<ProjectPlanningSection {...defaultProps} />);
    expect(screen.getByText("URGENT")).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.getByText("MEDIUM")).toBeInTheDocument();
    expect(screen.getByText("LOW")).toBeInTheDocument();
  });

  it("renders start and due date inputs", () => {
    render(<ProjectPlanningSection {...defaultProps} />);
    expect(screen.getAllByText("Start Date").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Due Date").length).toBeGreaterThanOrEqual(1);
  });

  it("shows due date error when present", () => {
    render(<ProjectPlanningSection {...defaultProps} errors={{ dueDate: "Due date required" }} />);
    expect(screen.getByText("Due date required")).toBeInTheDocument();
  });
});
