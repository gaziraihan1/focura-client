import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.PropsWithChildren<
    React.AnchorHTMLAttributes<HTMLAnchorElement>
  >) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, alt = "", ...imgProps } = props;
    return <img alt={alt} {...imgProps} data-fill={fill} />;
  },
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
      <div {...props}>{children}</div>
    ),
    button: ({
      children,
      ...props
    }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <>{children}</>,
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
    ShieldCheck: icon("ShieldCheck"),
    Scale: icon("Scale"),
    Cookie: icon("Cookie"),
    ReceiptText: icon("ReceiptText"),
    Layers: icon("Layers"),
    Search: icon("Search"),
    Bell: icon("Bell"),
    CheckCircle2: icon("CheckCircle2"),
    Loader2: icon("Loader2"),
    Mail: icon("Mail"),
    Clock: icon("Clock"),
    CreditCard: icon("CreditCard"),
    Calendar: icon("Calendar"),
    FileText: icon("FileText"),
    MessageSquare: icon("MessageSquare"),
    Copy: icon("Copy"),
    User: icon("User"),
    ChevronDown: icon("ChevronDown"),
    ChevronUp: icon("ChevronUp"),
    ExternalLink: icon("ExternalLink"),
    Database: icon("Database"),
    Settings2: icon("Settings2"),
    Share2: icon("Share2"),
    Globe: icon("Globe"),
    Lock: icon("Lock"),
    UserCog: icon("UserCog"),
    Baby: icon("Baby"),
    RefreshCw: icon("RefreshCw"),
    Eye: icon("Eye"),
    Pencil: icon("Pencil"),
    Trash2: icon("Trash2"),
    Download: icon("Download"),
    Ban: icon("Ban"),
    HandMetal: icon("HandMetal"),
    Megaphone: icon("Megaphone"),
    AlertTriangle: icon("AlertTriangle"),
    Info: icon("Info"),
    CheckCircle: icon("CheckCircle"),
    XCircle: icon("XCircle"),
    Scissors: icon("Scissors"),
    BarChart2: icon("BarChart2"),
    AlertCircle: icon("AlertCircle"),
    ToggleRight: icon("ToggleRight"),
    MonitorSmartphone: icon("MonitorSmartphone"),
    ArrowRight: icon("ArrowRight"),
    Zap: icon("Zap"),
    Rocket: icon("Rocket"),
    MousePointerClick: icon("MousePointerClick"),
    Sparkles: icon("Sparkles"),
    GitFork: icon("GitFork"),
    Star: icon("Star"),
    PlayCircle: icon("PlayCircle"),
    Check: icon("Check"),
    Minus: icon("Minus"),
    Users: icon("Users"),
    Workflow: icon("Workflow"),
    Gauge: icon("Gauge"),
    CloudLightning: icon("CloudLightning"),
    ThumbsUp: icon("ThumbsUp"),
    ThumbsDown: icon("ThumbsDown"),
    X: icon("X"),
    Lightbulb: icon("Lightbulb"),
    BookOpen: icon("BookOpen"),
    UserCheck: icon("UserCheck"),
    Pin: icon("Pin"),
  };
});

vi.mock("@/lib/utils", () => ({
  cn: (...args: (string | boolean | undefined | null)[]) =>
    args.filter(Boolean).join(" "),
}));

import { TermsSection } from "@/components/TermsAndConditions/TermsSection";

// Helper icon component for tests
const TestIcon = ({ ...p }: Record<string, unknown>) => (
  <svg {...p} data-testid="test-icon" />
);

describe("TermsSection", () => {
  it("renders with title and children", () => {
    render(
      <TermsSection
        id="test-section"
        title="My Section Title"
        icon={TestIcon}
        index={3}
      >
        <p>My content paragraph</p>
      </TermsSection>
    );

    expect(screen.getByText("My Section Title")).toBeInTheDocument();
    expect(screen.getByText("My content paragraph")).toBeInTheDocument();
  });

  it('displays "Section {index}" text', () => {
    render(
      <TermsSection
        id="intro"
        title="Introduction"
        icon={TestIcon}
        index={1}
      >
        <p>Content</p>
      </TermsSection>
    );

    expect(screen.getByText("Section 1")).toBeInTheDocument();
  });

  it("displays different index values correctly", () => {
    const { rerender } = render(
      <TermsSection
        id="section-5"
        title="Fifth Section"
        icon={TestIcon}
        index={5}
      >
        <p>Content</p>
      </TermsSection>
    );

    expect(screen.getByText("Section 5")).toBeInTheDocument();

    rerender(
      <TermsSection
        id="section-10"
        title="Tenth Section"
        icon={TestIcon}
        index={10}
      >
        <p>Content</p>
      </TermsSection>
    );

    expect(screen.getByText("Section 10")).toBeInTheDocument();
  });

  it("renders the icon component", () => {
    render(
      <TermsSection
        id="intro"
        title="Introduction"
        icon={TestIcon}
        index={1}
      >
        <p>Content</p>
      </TermsSection>
    );

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("applies the correct section id attribute", () => {
    const { container } = render(
      <TermsSection
        id="my-custom-id"
        title="Custom"
        icon={TestIcon}
        index={2}
      >
        <p>Content</p>
      </TermsSection>
    );

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "my-custom-id");
  });

  it("applies scroll-mt-28 class for scroll offset", () => {
    const { container } = render(
      <TermsSection
        id="intro"
        title="Intro"
        icon={TestIcon}
        index={1}
      >
        <p>Content</p>
      </TermsSection>
    );

    const section = container.querySelector("section");
    expect(section).toHaveClass("scroll-mt-28");
  });

  it("applies border-b class for visual separation", () => {
    const { container } = render(
      <TermsSection
        id="intro"
        title="Intro"
        icon={TestIcon}
        index={1}
      >
        <p>Content</p>
      </TermsSection>
    );

    const section = container.querySelector("section");
    expect(section).toHaveClass("border-b");
  });

  it("has last:border-0 and last:pb-0 classes (next section will be the last)", () => {
    // The component itself always has these classes; they are Tailwind responsive classes
    const { container } = render(
      <TermsSection
        id="last-section"
        title="Last Section"
        icon={TestIcon}
        index={7}
      >
        <p>Last content</p>
      </TermsSection>
    );

    const section = container.querySelector("section");
    expect(section).toHaveClass("last:border-0");
    expect(section).toHaveClass("last:pb-0");
  });

  it("renders the icon container with correct styling", () => {
    const { container } = render(
      <TermsSection
        id="intro"
        title="Intro"
        icon={TestIcon}
        index={1}
      >
        <p>Content</p>
      </TermsSection>
    );

    const iconContainer = container.querySelector(
      ".shrink-0.flex.items-center.justify-center"
    );
    expect(iconContainer).toBeInTheDocument();
  });

  it("renders multiple children correctly", () => {
    render(
      <TermsSection id="details" title="Details" icon={TestIcon} index={3}>
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </TermsSection>
    );

    expect(screen.getByText("First paragraph")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders children container with correct spacing class", () => {
    const { container } = render(
      <TermsSection
        id="intro"
        title="Intro"
        icon={TestIcon}
        index={1}
      >
        <p>Content</p>
      </TermsSection>
    );

    const childrenContainer = container.querySelector(".pl-13");
    expect(childrenContainer).toBeInTheDocument();
    expect(childrenContainer).toHaveClass("space-y-4");
  });
});
