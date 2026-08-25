import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GuideHeader } from "@/components/docs/guides/GuideHeader";
import { guideSections } from "./fixtures";

describe("GuideHeader", () => {
  it("renders the breadcrumb", () => {
    render(
      <GuideHeader
        current={guideSections[0]}
        mobileOpen={false}
        onMobileToggle={vi.fn()}
        query=""
        onQueryChange={vi.fn()}
      />
    );
    expect(screen.getByText("Focura")).toBeInTheDocument();
    expect(screen.getByText("User Guide")).toBeInTheDocument();
  });

  it("renders the current section label", () => {
    render(
      <GuideHeader
        current={guideSections[1]}
        mobileOpen={false}
        onMobileToggle={vi.fn()}
        query=""
        onQueryChange={vi.fn()}
      />
    );
    // The label appears in the desktop breadcrumb and the mobile toggle (both
    // are in the DOM; visibility is handled by responsive classes).
    expect(screen.getAllByText("Tasks & Subtasks").length).toBeGreaterThanOrEqual(1);
  });

  it("renders a search input and reports changes", () => {
    const onQueryChange = vi.fn();
    render(
      <GuideHeader
        current={guideSections[0]}
        mobileOpen={false}
        onMobileToggle={vi.fn()}
        query=""
        onQueryChange={onQueryChange}
      />
    );
    const input = screen.getByPlaceholderText("Search guides…");
    fireEvent.change(input, { target: { value: "task" } });
    expect(onQueryChange).toHaveBeenCalledWith("task");
  });

  it("opens the mobile drawer from the toggle button", () => {
    const onMobileToggle = vi.fn();
    render(
      <GuideHeader
        current={guideSections[0]}
        mobileOpen={false}
        onMobileToggle={onMobileToggle}
        query=""
        onQueryChange={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Toggle guide topics" }));
    expect(onMobileToggle).toHaveBeenCalledTimes(1);
  });

  it("reflects the open mobile drawer state on the toggle", () => {
    render(
      <GuideHeader
        current={guideSections[0]}
        mobileOpen={true}
        onMobileToggle={vi.fn()}
        query=""
        onQueryChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Toggle guide topics" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });
});
