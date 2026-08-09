import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";

// ─── Setup ─────────────────────────────────────────────────────────────────
let observerCallback: ((entries: IntersectionObserverEntry[]) => void) | null =
  null;
let observerDisconnect: ReturnType<typeof vi.fn>;
let testObserver: IntersectionObserver | null = null;

/** Create a DOM element with the given id and append to body */
function createSectionElement(id: string) {
  const el = document.createElement("section");
  el.id = id;
  el.style.height = "100px";
  document.body.appendChild(el);
  return el;
}

beforeEach(() => {
  observerCallback = null;
  observerDisconnect = vi.fn();
  testObserver = null;

  class MockIntersectionObserver {
    constructor(cb: (entries: IntersectionObserverEntry[]) => void) {
      observerCallback = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {
      observerDisconnect();
    }
  }

  // @ts-expect-error jsdom does not support IntersectionObserver
  globalThis.IntersectionObserver = MockIntersectionObserver as any;
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

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
  m: {
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
  useInView: () => false,
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
    Wifi: icon("Wifi"),
    WifiOff: icon("WifiOff"),
    Folder: icon("Folder"),
    File: icon("File"),
    Briefcase: icon("Briefcase"),
    Command: icon("Command"),
    Sparkles: icon("Sparkles"),
    RefreshCw: icon("RefreshCw"),
  };
});

vi.mock("@/lib/utils", () => ({
  cn: (...args: (string | boolean | undefined | null)[]) =>
    args.filter(Boolean).join(" "),
}));

import { TermsNav } from "@/components/TermsAndConditions/TermsNav";

describe("TermsNav", () => {
  it("renders nav items with labels", () => {
    render(
      <TermsNav
        items={[
          { id: "intro", label: "Introduction" },
          { id: "usage", label: "Usage" },
        ]}
      />
    );

    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Usage")).toBeInTheDocument();
  });

  it('renders "On this page" heading', () => {
    render(<TermsNav items={[]} />);
    expect(screen.getByText("On this page")).toBeInTheDocument();
  });

  it("renders index numbers for each item", () => {
    render(
      <TermsNav
        items={[
          { id: "a", label: "Alpha" },
          { id: "b", label: "Beta" },
          { id: "c", label: "Gamma" },
        ]}
      />
    );

    // Index numbers should be 1, 2, 3
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    expect(buttons[0].textContent).toContain("1");
    expect(buttons[1].textContent).toContain("2");
    expect(buttons[2].textContent).toContain("3");
  });

  it("renders sticky nav element with correct class", () => {
    const { container } = render(<TermsNav items={[{ id: "a", label: "A" }]} />);
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("sticky", "top-24", "w-full");
  });

  describe("active state", () => {
    it("marks the first item as active by default", () => {
      render(
        <TermsNav
          items={[
            { id: "intro", label: "Introduction" },
            { id: "usage", label: "Usage" },
          ]}
        />
      );

      const buttons = screen.getAllByRole("button");
      // First button should have the active class
      expect(buttons[0].className).toContain("bg-neutral-100");
      // Second button should NOT have the active class
      expect(buttons[1].className).not.toContain("bg-neutral-100");
    });

    it("has no active item when items array is empty", () => {
      const { container } = render(<TermsNav items={[]} />);
      const list = container.querySelector("ul");
      expect(list?.children).toHaveLength(0);
    });

    it("updates active id when IntersectionObserver fires", () => {
      createSectionElement("intro");
      createSectionElement("usage");

      render(
        <TermsNav
          items={[
            { id: "intro", label: "Introduction" },
            { id: "usage", label: "Usage" },
          ]}
        />
      );

      // Initially first is active
      let buttons = screen.getAllByRole("button");
      expect(buttons[0].className).toContain("bg-neutral-100");

      // Simulate IntersectionObserver seeing the second element
      act(() => {
        observerCallback?.([
          {
            isIntersecting: true,
            target: { id: "usage" },
          } as unknown as IntersectionObserverEntry,
        ]);
      });

      buttons = screen.getAllByRole("button");
      // Now second should be active
      expect(buttons[0].className).not.toContain("bg-neutral-100");
      expect(buttons[1].className).toContain("bg-neutral-100");
    });
  });

  describe("IntersectionObserver", () => {
    it("observes all item elements on mount", () => {
      createSectionElement("intro");
      createSectionElement("usage");

      const observeSpy = vi.fn();
      class ObserveSpyObserver {
        constructor(_cb: (entries: IntersectionObserverEntry[]) => void) {
          observerCallback = _cb;
        }
        observe(el: Element) {
          observeSpy(el);
        }
        unobserve() {}
        disconnect() {}
      }
      // @ts-expect-error mock
      globalThis.IntersectionObserver = ObserveSpyObserver;

      render(
        <TermsNav
          items={[
            { id: "intro", label: "Introduction" },
            { id: "usage", label: "Usage" },
          ]}
        />
      );

      expect(observeSpy).toHaveBeenCalledTimes(2);
    });

    it("disconnects observer on unmount", () => {
      const { unmount } = render(
        <TermsNav items={[{ id: "a", label: "A" }]} />
      );
      unmount();
      expect(observerDisconnect).toHaveBeenCalledTimes(1);
    });

    it("sets activeId to the observed intersecting element", () => {
      createSectionElement("intro");
      createSectionElement("usage");

      render(
        <TermsNav
          items={[
            { id: "intro", label: "Introduction" },
            { id: "usage", label: "Usage" },
          ]}
        />
      );

      act(() => {
        observerCallback?.([
          { isIntersecting: true, target: { id: "usage" } } as any,
        ]);
      });

      const buttons = screen.getAllByRole("button");
      expect(buttons[1].className).toContain("bg-neutral-100");
    });

    it("does not update activeId when no intersecting element found", () => {
      createSectionElement("intro");
      createSectionElement("usage");

      render(
        <TermsNav
          items={[
            { id: "intro", label: "Introduction" },
            { id: "usage", label: "Usage" },
          ]}
        />
      );

      // Simulate with a non-intersecting entry
      act(() => {
        observerCallback?.([
          { isIntersecting: false, target: { id: "usage" } } as any,
        ]);
      });

      const buttons = screen.getAllByRole("button");
      // First should still be active since no intersecting entry found
      expect(buttons[0].className).toContain("bg-neutral-100");
    });
  });

  describe("scrollTo", () => {
    it("scrolls to element with offset when button is clicked", () => {
      const scrollSpy = vi.fn();
      window.scrollTo = scrollSpy;

      // Set up DOM element with getBoundingClientRect
      const mockElement = document.createElement("div");
      mockElement.id = "usage";
      mockElement.getBoundingClientRect = () =>
        ({ top: 500 } as DOMRect);
      vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

      render(
        <TermsNav
          items={[
            { id: "intro", label: "Introduction" },
            { id: "usage", label: "Usage" },
          ]}
        />
      );

      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[1]); // Click "Usage"

      expect(scrollSpy).toHaveBeenCalledWith({
        top: 400, // 500 - 100
        behavior: "smooth",
      });
    });

    it("does nothing when element is not found", () => {
      const scrollSpy = vi.fn();
      window.scrollTo = scrollSpy;
      vi.spyOn(document, "getElementById").mockReturnValue(null);

      render(<TermsNav items={[{ id: "missing", label: "Missing" }]} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(scrollSpy).not.toHaveBeenCalled();
    });
  });

  describe("style classes", () => {
    it("applies active classes to the currently active item button", () => {
      render(<TermsNav items={[{ id: "a", label: "Alpha" }]} />);
      const button = screen.getByRole("button");
      expect(button.className).toContain("text-neutral-900");
      expect(button.className).toContain("bg-neutral-100");
      expect(button.className).toContain("font-medium");
    });

    it("applies inactive classes to non-active item buttons", () => {
      // Create a setup where the second item is "active" via IntersectionObserver
      render(
        <TermsNav
          items={[
            { id: "a", label: "Alpha" },
            { id: "b", label: "Beta" },
          ]}
        />
      );

      const buttons = screen.getAllByRole("button");
      // The second button should have inactive classes
      expect(buttons[1].className).toContain("text-neutral-500");
      expect(buttons[1].className).toContain("hover:text-neutral-700");
    });

    it("applies active index badge classes to active item", () => {
      render(<TermsNav items={[{ id: "a", label: "Alpha" }]} />);
      const button = screen.getByRole("button");
      // The inner span with index should have active colors
      expect(button.innerHTML).toContain("bg-neutral-900");
      expect(button.innerHTML).toContain("text-white");
    });

    it("applies inactive index badge classes to non-active items", () => {
      render(
        <TermsNav
          items={[
            { id: "a", label: "Alpha" },
            { id: "b", label: "Beta" },
          ]}
        />
      );

      const buttons = screen.getAllByRole("button");
      // Second button's inner span should have inactive badge classes
      expect(buttons[1].innerHTML).toContain("bg-neutral-200");
      expect(buttons[1].innerHTML).toContain("text-neutral-400");
    });
  });
});
