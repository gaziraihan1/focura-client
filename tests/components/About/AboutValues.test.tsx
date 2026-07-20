import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutValues } from "@/components/About/AboutValues";

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />;
    C.displayName = name;
    return C;
  };
  return {
    ShieldCheck: icon("ShieldCheck"),
    Cpu: icon("Cpu"),
    Puzzle: icon("Puzzle"),
    TestTube2: icon("TestTube2"),
    Eye: icon("Eye"),
    Zap: icon("Zap"),
  };
});

describe("AboutValues", () => {
  it("renders the section heading", () => {
    render(<AboutValues />);
    expect(screen.getByText(/Engineering Principles/)).toBeInTheDocument();
    expect(screen.getByText(/Values baked into/)).toBeInTheDocument();
  });

  it("renders all six value cards", () => {
    render(<AboutValues />);
    expect(screen.getByText("Security is Non-Negotiable")).toBeInTheDocument();
    expect(screen.getByText("Performance by Default")).toBeInTheDocument();
    expect(screen.getByText("Composable Architecture")).toBeInTheDocument();
    expect(screen.getByText("Full Type Safety")).toBeInTheDocument();
    expect(screen.getByText("Designed to be Tested")).toBeInTheDocument();
    expect(screen.getByText("Real-Time Without Compromise")).toBeInTheDocument();
  });

  it("renders value tags", () => {
    render(<AboutValues />);
    expect(screen.getByText("Security-First")).toBeInTheDocument();
    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(screen.getByText("Testability")).toBeInTheDocument();
  });
});
