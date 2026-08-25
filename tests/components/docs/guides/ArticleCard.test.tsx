import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ArticleCard } from "@/components/docs/guides/ArticleCard";

const article = {
  title: "Creating a task",
  content: "Click New Task and fill in the details.",
};

describe("ArticleCard", () => {
  it("renders the title and its position number", () => {
    render(<ArticleCard article={article} index={0} isOpen={false} onToggle={vi.fn()} />);
    expect(screen.getByText("Creating a task")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("hides the content when closed", () => {
    render(<ArticleCard article={article} index={0} isOpen={false} onToggle={vi.fn()} />);
    expect(screen.queryByText(/Click New Task/)).not.toBeInTheDocument();
  });

  it("shows the content and aria-expanded when open", () => {
    render(<ArticleCard article={article} index={0} isOpen={true} onToggle={vi.fn()} />);
    expect(screen.getByText(/Click New Task/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Creating a task/ })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("calls onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(<ArticleCard article={article} index={0} isOpen={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button", { name: /Creating a task/ }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
