import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SolutionsMetrics from "@/components/Solutions/SolutionsMetrics";

vi.mock("framer-motion", () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    span: (props: React.HTMLAttributes<HTMLSpanElement>) => <span {...props} />,
  },
  useMotionValue: (val: number) => ({
    on: () => vi.fn(),
    current: val,
  }),
  animate: () => ({ stop: vi.fn() }),
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

describe("SolutionsMetrics", () => {
  it("renders the section heading", () => {
    render(<SolutionsMetrics />);
    expect(screen.getByText(/Real results teams achieve with Focura/)).toBeInTheDocument();
  });

  it("renders all four metric labels", () => {
    render(<SolutionsMetrics />);
    expect(screen.getByText("Faster project delivery")).toBeInTheDocument();
    expect(screen.getByText("Increase in productivity")).toBeInTheDocument();
    expect(screen.getByText("Less time spent in meetings")).toBeInTheDocument();
    expect(screen.getByText("Saved per team per week")).toBeInTheDocument();
  });

  it("renders metric descriptions", () => {
    render(<SolutionsMetrics />);
    expect(screen.getByText(/Teams complete tasks significantly quicker/)).toBeInTheDocument();
    expect(screen.getByText(/Automation removes repetitive tasks/)).toBeInTheDocument();
  });
});
