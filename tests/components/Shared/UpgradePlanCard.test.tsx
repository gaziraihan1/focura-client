import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useParams: () => ({ workspaceSlug: "my-workspace" }),
  useRouter: () => ({ push: mockPush }),
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
    Sparkles: icon("Sparkles"),
    BarChart2: icon("BarChart2"),
    Users: icon("Users"),
    Zap: icon("Zap"),
    Lock: icon("Lock"),
  };
});

import { UpgradePlanCard } from "@/components/Shared/UpgradePlanCard";

describe("UpgradePlanCard", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders the feature name", () => {
    render(
      <UpgradePlanCard
        feature="Analytics"
        description="Get detailed analytics"
      />
    );

    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it('renders "Pro feature" badge', () => {
    render(
      <UpgradePlanCard feature="Analytics" description="Description" />
    );

    expect(screen.getByText("Pro feature")).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(
      <UpgradePlanCard
        feature="Analytics"
        description="Get detailed analytics for your workspace"
      />
    );

    expect(
      screen.getByText(/Get detailed analytics for your workspace/)
    ).toBeInTheDocument();
  });

  it('renders "Pro" highlighted in the description', () => {
    render(
      <UpgradePlanCard feature="Analytics" description="Detailed analytics" />
    );

    expect(screen.getByText("Pro")).toBeInTheDocument();
  });

  it("renders all plan perks", () => {
    render(
      <UpgradePlanCard feature="Analytics" description="Description" />
    );

    expect(screen.getByText("More projects & members")).toBeInTheDocument();
    expect(
      screen.getByText("Advanced analytics & reporting")
    ).toBeInTheDocument();
    expect(screen.getByText("Priority support")).toBeInTheDocument();
    expect(screen.getByText("More workspaces")).toBeInTheDocument();
    expect(screen.getByText("Storage management")).toBeInTheDocument();
    expect(screen.getByText("Workspace usage")).toBeInTheDocument();
  });

  describe("feature icons", () => {
    it("renders BarChart2 icon for Analytics feature", () => {
      render(
        <UpgradePlanCard feature="Analytics" description="Desc" />
      );
      expect(screen.getByTestId("BarChart2-icon")).toBeInTheDocument();
    });

    it("renders Users icon for Members feature", () => {
      render(
        <UpgradePlanCard feature="Members" description="Desc" />
      );
      expect(screen.getByTestId("Users-icon")).toBeInTheDocument();
    });

    it("renders Zap icon for Automations feature", () => {
      render(
        <UpgradePlanCard feature="Automations" description="Desc" />
      );
      expect(screen.getByTestId("Zap-icon")).toBeInTheDocument();
    });

    it("renders Lock icon for unknown features", () => {
      render(
        <UpgradePlanCard feature="CustomFeature" description="Desc" />
      );
      expect(screen.getByTestId("Lock-icon")).toBeInTheDocument();
    });
  });

  describe("action buttons", () => {
    it('navigates to upgrade page when "Upgrade to Pro" is clicked', () => {
      render(
        <UpgradePlanCard
          feature="Analytics"
          description="Detailed analytics"
        />
      );

      fireEvent.click(screen.getByText("Upgrade to Pro"));
      expect(mockPush).toHaveBeenCalledWith(
        "/dashboard/workspaces/my-workspace/billing/upgrade"
      );
    });

    it('navigates to upgrade page when "See plans" is clicked', () => {
      render(
        <UpgradePlanCard
          feature="Analytics"
          description="Detailed analytics"
        />
      );

      fireEvent.click(screen.getByText("See plans"));
      expect(mockPush).toHaveBeenCalledWith(
        "/dashboard/workspaces/my-workspace/billing/upgrade"
      );
    });
  });

  describe("contact support link", () => {
    it("renders contact support link with mailto href", () => {
      render(
        <UpgradePlanCard feature="Analytics" description="Desc" />
      );

      const link = screen.getByText("Contact support");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        "href",
        "mailto:support@yourapp.com"
      );
    });
  });

  describe("layout", () => {
    it("renders in a centered container", () => {
      const { container } = render(
        <UpgradePlanCard feature="Analytics" description="Desc" />
      );

      const flexContainer = container.querySelector(".flex");
      expect(flexContainer).toHaveClass("min-h-[60vh]");
      expect(flexContainer).toHaveClass("items-center");
      expect(flexContainer).toHaveClass("justify-center");
    });

    it("renders accent gradient strip at top of card", () => {
      const { container } = render(
        <UpgradePlanCard feature="Analytics" description="Desc" />
      );

      const accent = container.querySelector(".h-1");
      expect(accent).toBeInTheDocument();
      expect(accent?.className).toContain("bg-linear-to-r");
    });
  });
});
