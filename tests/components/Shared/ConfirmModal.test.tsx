/**
 * tests/components/Shared/ConfirmModal.test.tsx
 *
 * Tests for ConfirmModal component.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createElement } from "react";
import { ConfirmModal } from "@/components/Shared/ConfirmModal";

// Mock lucide-react
vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid={`icon-${name}`} {...props} />
    );
    C.displayName = name;
    return C;
  };
  return {
    AlertTriangle: icon("AlertTriangle"),
    X: icon("X"),
  };
});

describe("ConfirmModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: "Delete Item",
    message: "Are you sure you want to delete this item?",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when isOpen is true", () => {
    render(createElement(ConfirmModal, defaultProps));

    expect(screen.getByText("Delete Item")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to delete this item?")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      createElement(ConfirmModal, {
        ...defaultProps,
        isOpen: false,
      })
    );

    expect(screen.queryByText("Delete Item")).not.toBeInTheDocument();
  });

  it("renders with custom confirm and cancel text", () => {
    render(
      createElement(ConfirmModal, {
        ...defaultProps,
        confirmText: "Yes, Delete",
        cancelText: "No, Keep",
      })
    );

    expect(screen.getByText("Yes, Delete")).toBeInTheDocument();
    expect(screen.getByText("No, Keep")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    render(createElement(ConfirmModal, defaultProps));

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel button is clicked", () => {
    render(createElement(ConfirmModal, defaultProps));

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when X button is clicked", () => {
    render(createElement(ConfirmModal, defaultProps));

    const closeButton = screen.getByTestId("icon-X").closest("button");
    fireEvent.click(closeButton!);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("renders danger variant by default", () => {
    render(createElement(ConfirmModal, defaultProps));

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton.className).toContain("bg-red-600");
  });

  it("renders warning variant", () => {
    render(
      createElement(ConfirmModal, {
        ...defaultProps,
        variant: "warning",
      })
    );

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton.className).toContain("bg-amber-600");
  });

  it("renders info variant", () => {
    render(
      createElement(ConfirmModal, {
        ...defaultProps,
        variant: "info",
      })
    );

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton.className).toContain("bg-blue-600");
  });

  it("disables buttons when isLoading is true", () => {
    render(
      createElement(ConfirmModal, {
        ...defaultProps,
        isLoading: true,
      })
    );

    const confirmButton = screen.getByText("Processing...");
    const cancelButton = screen.getByText("Cancel");

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it("shows loading text when isLoading is true", () => {
    render(
      createElement(ConfirmModal, {
        ...defaultProps,
        isLoading: true,
      })
    );

    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("does not call onClose when loading and cancel is clicked", () => {
    render(
      createElement(ConfirmModal, {
        ...defaultProps,
        isLoading: true,
      })
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
});
