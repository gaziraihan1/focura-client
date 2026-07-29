import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

const mockUseOfflineStatus = vi.fn();
vi.mock("@/hooks/useOfflineStatus", () => ({
  useOfflineStatus: () => mockUseOfflineStatus(),
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
    Wifi: icon("Wifi"),
    WifiOff: icon("WifiOff"),
    RefreshCw: icon("RefreshCw"),
  };
});

vi.mock("@/lib/utils", () => ({
  cn: (...args: (string | boolean | undefined | null)[]) =>
    args.filter(Boolean).join(" "),
}));

import { OfflineIndicator } from "@/components/Shared/OfflineIndicator";

describe("OfflineIndicator", () => {
  beforeEach(() => {
    mockUseOfflineStatus.mockReset();
  });

  it("returns null when online and no pending items", () => {
    mockUseOfflineStatus.mockReturnValue({
      isOnline: true,
      isOffline: false,
      pendingCount: 0,
      syncPending: vi.fn(),
    });

    const { container } = render(<OfflineIndicator />);
    expect(container.firstChild).toBeNull();
  });

  it("renders offline indicator when offline", () => {
    mockUseOfflineStatus.mockReturnValue({
      isOnline: false,
      isOffline: true,
      pendingCount: 0,
      syncPending: vi.fn(),
    });

    render(<OfflineIndicator />);
    expect(screen.getByText("Offline")).toBeInTheDocument();
    expect(screen.getByTestId("WifiOff-icon")).toBeInTheDocument();
  });

  it("renders offline with pending count", () => {
    mockUseOfflineStatus.mockReturnValue({
      isOnline: false,
      isOffline: true,
      pendingCount: 3,
      syncPending: vi.fn(),
    });

    render(<OfflineIndicator />);
    expect(screen.getByText("Offline")).toBeInTheDocument();
    expect(screen.getByText("3 pending")).toBeInTheDocument();
  });

  it("renders online with syncing indicator when pending > 0", () => {
    const syncPending = vi.fn();
    mockUseOfflineStatus.mockReturnValue({
      isOnline: true,
      isOffline: false,
      pendingCount: 2,
      syncPending,
    });

    render(<OfflineIndicator />);
    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.getByText("2 syncing")).toBeInTheDocument();
    expect(screen.getByTestId("RefreshCw-icon")).toBeInTheDocument();
    expect(screen.getByTestId("Wifi-icon")).toBeInTheDocument();
  });

  it("calls syncPending when sync button is clicked", () => {
    const syncPending = vi.fn();
    mockUseOfflineStatus.mockReturnValue({
      isOnline: true,
      isOffline: false,
      pendingCount: 1,
      syncPending,
    });

    render(<OfflineIndicator />);
    const syncButton = screen.getByLabelText("Sync now");
    fireEvent.click(syncButton);
    expect(syncPending).toHaveBeenCalledTimes(1);
  });

  it("applies yellow/amber styles when offline", () => {
    mockUseOfflineStatus.mockReturnValue({
      isOnline: false,
      isOffline: true,
      pendingCount: 0,
      syncPending: vi.fn(),
    });

    const { container } = render(<OfflineIndicator />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("bg-yellow-500/10");
  });

  it("applies blue styles when online with pending", () => {
    mockUseOfflineStatus.mockReturnValue({
      isOnline: true,
      isOffline: false,
      pendingCount: 1,
      syncPending: vi.fn(),
    });

    const { container } = render(<OfflineIndicator />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("bg-blue-500/10");
  });

  it("applies custom className", () => {
    mockUseOfflineStatus.mockReturnValue({
      isOnline: true,
      isOffline: false,
      pendingCount: 1,
      syncPending: vi.fn(),
    });

    const { container } = render(
      <OfflineIndicator className="custom-class" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("custom-class");
  });
});
