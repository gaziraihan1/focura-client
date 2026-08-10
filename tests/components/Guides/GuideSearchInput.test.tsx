import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GuideSearchInput } from "@/components/Guides/GuideSearchInput";

describe("GuideSearchInput", () => {
  it("renders a search field with placeholder", () => {
    render(<GuideSearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Search guides…")).toBeInTheDocument();
  });

  it("reports changes as the user types", () => {
    const onChange = vi.fn();
    render(<GuideSearchInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText("Search guides…"), {
      target: { value: "focus" },
    });
    expect(onChange).toHaveBeenCalledWith("focus");
  });

  it("clears the value from the clear button", () => {
    const onChange = vi.fn();
    render(<GuideSearchInput value="focus" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("does not show the clear button when empty", () => {
    render(<GuideSearchInput value="" onChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });
});
