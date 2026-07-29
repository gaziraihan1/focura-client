import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

const mockUseServiceWorker = vi.fn();
vi.mock("@/hooks/useServiceWorker", () => ({
  useServiceWorker: () => mockUseServiceWorker(),
}));

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid={`${name}-icon`} {...props} />
    );
    Component.displayName = name;
    return Component;
  };
  return {
    RefreshCw: icon("RefreshCw"),
    X: icon("X"),
  };
});

vi.mock("@/lib/utils", () => ({
  cn: (...args: (string | boolean | undefined | null)[]) =>
    args.filter(Boolean).join(" "),
}));

import { UpdatePrompt } from "@/components/Shared/UpdatePrompt";

describe("UpdatePrompt", () => {
  beforeEach(() => {
    mockUseServiceWorker.mockReset();
  });

  it("returns null when not waiting for update", () => {
    mockUseServiceWorker.mockReturnValue({
      isWaiting: false,
      update: vi.fn(),
    });

    const { container } = render(<UpdatePrompt />);
    expect(container.firstChild).toBeNull();
  });

  it("renders update prompt when waiting for update", () => {
    mockUseServiceWorker.mockReturnValue({
      isWaiting: true,
      update: vi.fn(),
    });

    render(<UpdatePrompt />);
    expect(screen.getByText("New version available")).toBeInTheDocument();
    expect(
      screen.getByText("Refresh to get the latest updates")
    ).toBeInTheDocument();
  });

  it("renders RefreshCw icon", () => {
    mockUseServiceWorker.mockReturnValue({
      isWaiting: true,
      update: vi.fn(),
    });

    render(<UpdatePrompt />);
    expect(screen.getByTestId("RefreshCw-icon")).toBeInTheDocument();
  });

  it("renders Update button", () => {
    mockUseServiceWorker.mockReturnValue({
      isWaiting: true,
      update: vi.fn(),
    });

    render(<UpdatePrompt />);
    expect(screen.getByText("Update")).toBeInTheDocument();
  });

  it("calls update when Update button is clicked", () => {
    const update = vi.fn();
    mockUseServiceWorker.mockReturnValue({
      isWaiting: true,
      update,
    });

    render(<UpdatePrompt />);
    fireEvent.click(screen.getByText("Update"));
    expect(update).toHaveBeenCalledTimes(1);
  });

  it("dismisses when X button is clicked", () => {
    mockUseServiceWorker.mockReturnValue({
      isWaiting: true,
      update: vi.fn(),
    });

    render(<UpdatePrompt />);
    expect(screen.getByText("New version available")).toBeInTheDocument();

    // Dismiss
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(
      screen.queryByText("New version available")
    ).not.toBeInTheDocument();
  });

  it("returns null after being dismissed", () => {
    mockUseServiceWorker.mockReturnValue({
      isWaiting: true,
      update: vi.fn(),
    });

    const { container } = render(<UpdatePrompt />);
    // Dismiss
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(container.firstChild).toBeNull();
  });

  it("applies custom className", () => {
    mockUseServiceWorker.mockReturnValue({
      isWaiting: true,
      update: vi.fn(),
    });

    const { container } = render(
      <UpdatePrompt className="my-custom-class" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("my-custom-class");
  });
});
