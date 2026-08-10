import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GuideSectionList } from "@/components/Guides/GuideSectionList";
import { guideSections } from "./fixtures";

describe("GuideSectionList", () => {
  it("renders every article title in the section", () => {
    render(<GuideSectionList section={guideSections[0]} openArticle={null} onToggleArticle={vi.fn()} />);
    expect(screen.getByText("Creating your account")).toBeInTheDocument();
    expect(screen.getByText("Creating your workspace")).toBeInTheDocument();
  });

  it("shows the open article content", () => {
    render(
      <GuideSectionList
        section={guideSections[0]}
        openArticle="getting-started::Creating your account"
        onToggleArticle={vi.fn()}
      />
    );
    expect(screen.getByText(/Sign up with your email/)).toBeInTheDocument();
  });

  it("calls onToggleArticle with the article key", () => {
    const onToggleArticle = vi.fn();
    render(<GuideSectionList section={guideSections[0]} openArticle={null} onToggleArticle={onToggleArticle} />);
    fireEvent.click(screen.getByRole("button", { name: /Creating your workspace/ }));
    expect(onToggleArticle).toHaveBeenCalledWith("getting-started::Creating your workspace");
  });
});
