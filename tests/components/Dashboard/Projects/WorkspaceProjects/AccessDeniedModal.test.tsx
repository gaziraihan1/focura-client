import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

vi.mock("lucide-react", () => {
  return {
    X: (props: Record<string, unknown>) =>
      React.createElement("svg", { "data-testid": "x-icon", ...props }),
  };
});

import { AccessDeniedModal } from "@/components/Dashboard/Projects/WorkspaceProjects/AceessDeniedModal";

describe("AccessDeniedModal", () => {
  it("renders nothing when not open", () => {
    const { container } = render(
      <AccessDeniedModal isOpen={false} onClose={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders when open", () => {
    render(<AccessDeniedModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText("Access Restricted")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<AccessDeniedModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/You don/)).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(<AccessDeniedModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /close modal/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when "Close" button clicked', () => {
    const onClose = vi.fn();
    render(<AccessDeniedModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <AccessDeniedModal isOpen={true} onClose={onClose} />,
    );
    const backdrop = container.querySelector(".fixed.inset-0");
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when inner content clicked", () => {
    const onClose = vi.fn();
    render(<AccessDeniedModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText("Access Restricted"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
