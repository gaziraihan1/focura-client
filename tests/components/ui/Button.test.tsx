import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button, buttonVariants } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children and defaults to type=button", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: "Click me" });
    expect(btn).toHaveAttribute("type", "button");
    expect(btn).toHaveClass("bg-primary");
  });

  it("applies variant and size classes", () => {
    render(<Button variant="outline" size="sm">Hi</Button>);
    expect(screen.getByRole("button")).toHaveClass("border", "border-border/70", "h-8");
  });

  it("applies type=submit when passed", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("calls onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disables and shows spinner when loading", () => {
    render(<Button loading>Save</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn.querySelector("svg.animate-spin")).toBeInTheDocument();
  });

  it("merges caller className (caller wins on conflicts)", () => {
    render(<Button className="rounded-xl w-full">Styled</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("rounded-xl", "w-full");
    // default size radius (rounded-lg) should be overridden by tw-merge
    expect(btn).not.toHaveClass("rounded-lg");
  });

  it("buttonVariants returns a class string with variant classes", () => {
    const cls = buttonVariants({ variant: "ghost", size: "icon" });
    expect(cls).toContain("hover:bg-accent");
    expect(cls).toContain("h-9");
  });

  it("forwards ref", () => {
    let el: HTMLButtonElement | null = null;
    render(
      <Button ref={(n) => { el = n; }}>Ref</Button>
    );
    expect(el).toBeInstanceOf(HTMLButtonElement);
  });
});
