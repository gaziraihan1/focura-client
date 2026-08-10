import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHero } from "@/components/Guides/SectionHero";
import { guideSections } from "./fixtures";

describe("SectionHero", () => {
  it("renders the section title, subtitle, and icon", () => {
    render(<SectionHero section={guideSections[1]} />);
    expect(screen.getByText("Tasks & Subtasks")).toBeInTheDocument();
    expect(screen.getByText("Create, assign, and track work items")).toBeInTheDocument();
    expect(screen.getByText("◉")).toBeInTheDocument();
  });

  it("renders the article count", () => {
    render(<SectionHero section={guideSections[1]} />);
    expect(screen.getByText("2 articles")).toBeInTheDocument();
  });

  it("uses singular wording for a single article", () => {
    render(<SectionHero section={guideSections[2]} />);
    expect(screen.getByText("1 article")).toBeInTheDocument();
  });

  it("renders an estimated read time", () => {
    render(<SectionHero section={guideSections[0]} />);
    expect(screen.getByText(/min read/)).toBeInTheDocument();
  });
});
