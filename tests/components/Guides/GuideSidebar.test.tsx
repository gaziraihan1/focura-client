import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GuideSidebar } from "@/components/Guides/GuideSidebar";
import { guideSections } from "./fixtures";

describe("GuideSidebar", () => {
  const onNavigate = vi.fn();
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all section labels and the Topics header", () => {
    render(
      <GuideSidebar
        sections={guideSections}
        activeId="tasks"
        mobileOpen={false}
        onNavigate={onNavigate}
        onClose={onClose}
      />
    );
    expect(screen.getByText("Topics")).toBeInTheDocument();
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Tasks & Subtasks")).toBeInTheDocument();
    expect(screen.getByText("Billing & Plans")).toBeInTheDocument();
  });

  it("renders article counts per section", () => {
    render(
      <GuideSidebar
        sections={guideSections}
        activeId="tasks"
        mobileOpen={false}
        onNavigate={onNavigate}
        onClose={onClose}
      />
    );
    expect(screen.getAllByText("2")).toHaveLength(2); // getting-started + tasks
    expect(screen.getByText("1")).toBeInTheDocument(); // billing
  });

  it("marks the active section with aria-current", () => {
    render(
      <GuideSidebar
        sections={guideSections}
        activeId="tasks"
        mobileOpen={false}
        onNavigate={onNavigate}
        onClose={onClose}
      />
    );
    expect(screen.getByRole("button", { name: /Tasks & Subtasks/ })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("calls onNavigate when a section is clicked", () => {
    render(
      <GuideSidebar
        sections={guideSections}
        activeId="tasks"
        mobileOpen={false}
        onNavigate={onNavigate}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Billing & Plans/ }));
    expect(onNavigate).toHaveBeenCalledWith("billing");
  });

  it("renders the mobile drawer and closes it", () => {
    render(
      <GuideSidebar
        sections={guideSections}
        activeId="tasks"
        mobileOpen={true}
        onNavigate={onNavigate}
        onClose={onClose}
      />
    );
    expect(screen.getByRole("button", { name: "Close guide topics" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close guide topics" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
