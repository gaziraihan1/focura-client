import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

const mockBack = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: mockBack }),
}));

vi.mock("lucide-react", () => ({
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="alert-circle" {...props} />
  ),
}));

import { ErrorFallback } from "@/components/shared/ErrorFallback";

describe("ErrorFallback", () => {
  const baseError = new Error("Test error message");

  beforeEach(() => {
    mockBack.mockClear();
  });

  it("renders default title when not provided", () => {
    render(<ErrorFallback error={baseError} reset={vi.fn()} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders custom title when provided", () => {
    render(
      <ErrorFallback
        error={baseError}
        reset={vi.fn()}
        title="Custom Error Title"
      />
    );
    expect(screen.getByText("Custom Error Title")).toBeInTheDocument();
  });

  it("renders the error message", () => {
    render(<ErrorFallback error={baseError} reset={vi.fn()} />);
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("renders custom description when provided instead of error message", () => {
    render(
      <ErrorFallback
        error={baseError}
        reset={vi.fn()}
        description="Custom description"
      />
    );
    expect(screen.getByText("Custom description")).toBeInTheDocument();
  });

  it('renders "An unexpected error occurred." when no message or description', () => {
    const emptyError = new Error();
    render(<ErrorFallback error={emptyError} reset={vi.fn()} />);
    expect(
      screen.getByText("An unexpected error occurred.")
    ).toBeInTheDocument();
  });

  it("renders AlertCircle icon", () => {
    render(<ErrorFallback error={baseError} reset={vi.fn()} />);
    expect(screen.getByTestId("alert-circle")).toBeInTheDocument();
  });

  describe("Try Again button", () => {
    it("renders and calls reset on click", () => {
      const reset = vi.fn();
      render(<ErrorFallback error={baseError} reset={reset} />);

      const tryAgainButton = screen.getByText("Try Again");
      expect(tryAgainButton).toBeInTheDocument();

      fireEvent.click(tryAgainButton);
      expect(reset).toHaveBeenCalledTimes(1);
    });
  });

  describe("Go Back button", () => {
    it("renders and calls router.back() on click", () => {
      render(<ErrorFallback error={baseError} reset={vi.fn()} />);

      const goBackButton = screen.getByText("Go Back");
      expect(goBackButton).toBeInTheDocument();

      fireEvent.click(goBackButton);
      expect(mockBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("error details", () => {
    it("shows error details details element when error has message", () => {
      render(<ErrorFallback error={baseError} reset={vi.fn()} />);
      expect(screen.getByText("Error details")).toBeInTheDocument();
    });

    it("does not show error details when error has no message and no stack", () => {
      const emptyError = { name: "Error", message: "" } as Error;
      render(<ErrorFallback error={emptyError} reset={vi.fn()} />);
      expect(screen.queryByText("Error details")).not.toBeInTheDocument();
    });

    it("shows error message in the details pre block", () => {
      render(<ErrorFallback error={baseError} reset={vi.fn()} />);
      const details = screen.getByText("Error details");
      fireEvent.click(details); // Open details
      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("shows error stack trace in details when available", () => {
      const errorWithStack = new Error("With stack");
      errorWithStack.stack = "Error: With stack\n  at Test (file.ts:1:2)";
      render(<ErrorFallback error={errorWithStack} reset={vi.fn()} />);
      const details = screen.getByText("Error details");
      fireEvent.click(details);
      expect(
        screen.getByText(/Error: With stack/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/at Test/)
      ).toBeInTheDocument();
    });
  });

  describe("error digest", () => {
    it("renders error digest when provided", () => {
      const errorWithDigest = new Error("Digest error");
      (errorWithDigest as any).digest = "ERR-12345";
      render(<ErrorFallback error={errorWithDigest} reset={vi.fn()} />);
      expect(screen.getByText("Error ID: ERR-12345")).toBeInTheDocument();
    });

    it("does not render error digest when not provided", () => {
      render(<ErrorFallback error={baseError} reset={vi.fn()} />);
      expect(screen.queryByText(/Error ID:/)).not.toBeInTheDocument();
    });
  });

  describe("layout and styling", () => {
    it("renders in a centered container", () => {
      const { container } = render(
        <ErrorFallback error={baseError} reset={vi.fn()} />
      );
      const flexContainer = container.querySelector(".flex");
      expect(flexContainer).toHaveClass("min-h-[60vh]");
      expect(flexContainer).toHaveClass("items-center");
      expect(flexContainer).toHaveClass("justify-center");
    });

    it("renders card with border and rounded styles", () => {
      const { container } = render(
        <ErrorFallback error={baseError} reset={vi.fn()} />
      );
      const card = container.querySelector(".rounded-xl");
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("border");
    });
  });
});
