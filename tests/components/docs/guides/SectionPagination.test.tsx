import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SectionPagination } from "@/components/docs/guides/SectionPagination";
import { guideSections } from "./fixtures";

describe("SectionPagination", () => {
  const onNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Previous and Next buttons", () => {
    render(<SectionPagination sections={guideSections} activeId="tasks" onNavigate={onNavigate} />);
    expect(screen.getByText(/Previous/)).toBeInTheDocument();
    expect(screen.getByText(/Next/)).toBeInTheDocument();
  });

  it("renders section labels for prev and next", () => {
    render(<SectionPagination sections={guideSections} activeId="tasks" onNavigate={onNavigate} />);
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Billing & Plans")).toBeInTheDocument();
  });

  it("calls onNavigate with the correct id when prev is clicked", () => {
    render(<SectionPagination sections={guideSections} activeId="tasks" onNavigate={onNavigate} />);
    fireEvent.click(screen.getByText("Getting Started"));
    expect(onNavigate).toHaveBeenCalledWith("getting-started");
  });

  it("calls onNavigate with the correct id when next is clicked", () => {
    render(<SectionPagination sections={guideSections} activeId="tasks" onNavigate={onNavigate} />);
    fireEvent.click(screen.getByText("Billing & Plans"));
    expect(onNavigate).toHaveBeenCalledWith("billing");
  });

  it("does not render Previous when on the first section", () => {
    render(
      <SectionPagination sections={guideSections} activeId="getting-started" onNavigate={onNavigate} />
    );
    expect(screen.queryByText(/Previous/)).not.toBeInTheDocument();
    expect(screen.getByText(/Next/)).toBeInTheDocument();
  });

  it("does not render Next when on the last section", () => {
    render(<SectionPagination sections={guideSections} activeId="billing" onNavigate={onNavigate} />);
    expect(screen.getByText(/Previous/)).toBeInTheDocument();
    expect(screen.queryByText(/Next/)).not.toBeInTheDocument();
  });
});
