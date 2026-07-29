import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid={`${name}-icon`} {...props} />
    );
    Component.displayName = name;
    return Component;
  };
  return {
    ChevronDown: icon("ChevronDown"),
  };
});

vi.mock("@/lib/utils", () => ({
  cn: (...args: (string | boolean | undefined | null)[]) =>
    args.filter(Boolean).join(" "),
}));

import { LegalMobileNav } from "@/components/Shared/LegalMobileNav";

describe("LegalMobileNav", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders "Jump to section" button by default', () => {
    render(
      <LegalMobileNav
        items={[
          { id: "intro", label: "Introduction" },
          { id: "usage", label: "Usage" },
        ]}
      />
    );

    expect(screen.getByText("Jump to section")).toBeInTheDocument();
  });

  it("renders ChevronDown icon", () => {
    render(
      <LegalMobileNav
        items={[{ id: "a", label: "A" }]}
      />
    );

    expect(screen.getByTestId("ChevronDown-icon")).toBeInTheDocument();
  });

  it("dropdown is hidden by default", () => {
    render(
      <LegalMobileNav
        items={[
          { id: "intro", label: "Introduction" },
          { id: "usage", label: "Usage" },
        ]}
      />
    );

    // The dropdown items should not be visible initially
    expect(screen.queryByText("Introduction")).not.toBeInTheDocument();
    expect(screen.queryByText("Usage")).not.toBeInTheDocument();
  });

  it("opens dropdown when button is clicked", () => {
    render(
      <LegalMobileNav
        items={[
          { id: "intro", label: "Introduction" },
          { id: "usage", label: "Usage" },
        ]}
      />
    );

    fireEvent.click(screen.getByText("Jump to section"));

    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Usage")).toBeInTheDocument();
  });

  it("closes dropdown when button is clicked again", () => {
    render(
      <LegalMobileNav
        items={[
          { id: "intro", label: "Introduction" },
        ]}
      />
    );

    const toggleButton = screen.getByText("Jump to section");

    // Open
    fireEvent.click(toggleButton);
    expect(screen.getByText("Introduction")).toBeInTheDocument();

    // Close
    fireEvent.click(toggleButton);
    expect(
      screen.queryByText("Introduction")
    ).not.toBeInTheDocument();
  });

  it("renders index numbers for each item in dropdown", () => {
    render(
      <LegalMobileNav
        items={[
          { id: "a", label: "Alpha" },
          { id: "b", label: "Beta" },
          { id: "c", label: "Gamma" },
        ]}
      />
    );

    fireEvent.click(screen.getByText("Jump to section"));

    const items = screen.getAllByText(/Alpha|Beta|Gamma/);
    expect(items).toHaveLength(3);
  });

  it("scrolls to element and closes dropdown when an item is clicked", () => {
    // Mock scrollTo
    const scrollSpy = vi.fn();
    window.scrollTo = scrollSpy;

    // Mock getElementById and getBoundingClientRect
    const mockElement = document.createElement("div");
    mockElement.id = "usage";
    mockElement.getBoundingClientRect = () =>
      ({ top: 800 } as DOMRect);
    const getByIdSpy = vi
      .spyOn(document, "getElementById")
      .mockReturnValue(mockElement);

    render(
      <LegalMobileNav
        items={[
          { id: "intro", label: "Introduction" },
          { id: "usage", label: "Usage" },
        ]}
      />
    );

    // Open dropdown
    fireEvent.click(screen.getByText("Jump to section"));
    expect(screen.getByText("Usage")).toBeInTheDocument();

    // Click "Usage" item
    fireEvent.click(screen.getByText("Usage"));

    expect(scrollSpy).toHaveBeenCalledWith({
      top: 700, // 800 - 100
      behavior: "smooth",
    });
    expect(getByIdSpy).toHaveBeenCalledWith("usage");

    // Dropdown should close
    expect(
      screen.queryByText("Usage")
    ).not.toBeInTheDocument();

    getByIdSpy.mockRestore();
  });

  it("does nothing when element is not found on scroll", () => {
    const scrollSpy = vi.fn();
    window.scrollTo = scrollSpy;

    vi.spyOn(document, "getElementById").mockReturnValue(null);

    render(
      <LegalMobileNav
        items={[{ id: "missing", label: "Missing" }]}
      />
    );

    fireEvent.click(screen.getByText("Jump to section"));
    fireEvent.click(screen.getByText("Missing"));

    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it("renders the lg:hidden class on the container", () => {
    const { container } = render(
      <LegalMobileNav
        items={[{ id: "a", label: "A" }]}
      />
    );

    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("lg:hidden");
  });

  it("applies ChevronDown rotation when dropdown is open", () => {
    render(
      <LegalMobileNav
        items={[{ id: "a", label: "A" }]}
      />
    );

    const chevronBefore = screen.getByTestId("ChevronDown-icon");
    expect(chevronBefore.getAttribute("class")).not.toContain("rotate-180");

    fireEvent.click(screen.getByText("Jump to section"));

    const chevronAfter = screen.getByTestId("ChevronDown-icon");
    expect(chevronAfter.getAttribute("class")).toContain("rotate-180");
  });

  it("renders empty dropdown with no items", () => {
    render(<LegalMobileNav items={[]} />);

    fireEvent.click(screen.getByText("Jump to section"));

    // Should render the open dropdown container but no items
    const dropdown = screen.queryByText("Jump to section")
      ?.closest("div")
      ?.querySelector(".absolute");
    expect(dropdown).toBeInTheDocument();
  });
});
