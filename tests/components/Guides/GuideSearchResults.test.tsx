import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GuideSearchResults } from "@/components/Guides/GuideSearchResults";
import { guideSections } from "./fixtures";
import { searchGuides } from "@/utils/guides.utils";

describe("GuideSearchResults", () => {
  it("renders the result count and matching articles", () => {
    const results = searchGuides(guideSections, "task");
    render(<GuideSearchResults query="task" results={results} onOpen={vi.fn()} />);
    expect(screen.getByText(/results for/)).toBeInTheDocument();
    expect(screen.getByText("Creating a task")).toBeInTheDocument();
    // The section chip appears on every result card from that section.
    expect(screen.getAllByText("Tasks & Subtasks").length).toBeGreaterThanOrEqual(1);
  });

  it("renders a snippet of the article content", () => {
    const results = searchGuides(guideSections, "plans");
    render(<GuideSearchResults query="plans" results={results} onOpen={vi.fn()} />);
    expect(screen.getByText(/Free, Pro, Business/)).toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", () => {
    render(<GuideSearchResults query="zzz" results={[]} onOpen={vi.fn()} />);
    expect(screen.getByText(/No results/)).toBeInTheDocument();
  });

  it("calls onOpen with the section id and article key", () => {
    const onOpen = vi.fn();
    const results = searchGuides(guideSections, "recurring");
    render(<GuideSearchResults query="recurring" results={results} onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button", { name: /Recurring tasks/ }));
    expect(onOpen).toHaveBeenCalledWith("tasks", "tasks::Recurring tasks");
  });
});
