import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RepeatControl, EMPTY_REPEAT, type RepeatValue } from "@/components/Tasks/form/RepeatControl";

function renderControlled(initial: RepeatValue, onChange = vi.fn()) {
  render(<RepeatControl value={initial} onChange={onChange} />);
  return { onChange };
}

describe("RepeatControl", () => {
  it("renders the label and all pattern options", () => {
    renderControlled(EMPTY_REPEAT);
    expect(screen.getByText("Repeat")).toBeInTheDocument();
    for (const label of ["None", "Daily", "Weekly", "Monthly", "Custom"]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  });

  it("emits a weekly value when Weekly is clicked", () => {
    const { onChange } = renderControlled(EMPTY_REPEAT);
    fireEvent.click(screen.getByRole("button", { name: "Weekly" }));
    expect(onChange).toHaveBeenCalledWith({
      pattern: "WEEKLY",
      interval: 1,
      days: [],
      endsAt: "",
    });
  });

  it("shows weekday chips for weekly and toggles them", () => {
    const { onChange } = renderControlled({ pattern: "WEEKLY", interval: 1, days: [], endsAt: "" });
    const monday = screen.getByRole("button", { name: "Repeat on Monday" });
    fireEvent.click(monday);
    expect(onChange).toHaveBeenCalledWith({
      pattern: "WEEKLY",
      interval: 1,
      days: [1],
      endsAt: "",
    });
  });

  it("increments the interval", () => {
    const { onChange } = renderControlled({ pattern: "DAILY", interval: 1, days: [], endsAt: "" });
    fireEvent.click(screen.getByRole("button", { name: "Increase repeat interval" }));
    expect(onChange).toHaveBeenLastCalledWith({
      pattern: "DAILY",
      interval: 2,
      days: [],
      endsAt: "",
    });
  });

  it("decrements the interval but never below 1", () => {
    const { onChange } = renderControlled({ pattern: "DAILY", interval: 2, days: [], endsAt: "" });
    fireEvent.click(screen.getByRole("button", { name: "Decrease repeat interval" }));
    expect(onChange).toHaveBeenLastCalledWith({
      pattern: "DAILY",
      interval: 1,
      days: [],
      endsAt: "",
    });
    fireEvent.click(screen.getByRole("button", { name: "Decrease repeat interval" }));
    // interval is already at the minimum → stays 1
    expect(onChange).toHaveBeenLastCalledWith({
      pattern: "DAILY",
      interval: 1,
      days: [],
      endsAt: "",
    });
  });

  it("shows a human-readable summary for weekly with weekdays", () => {
    renderControlled({ pattern: "WEEKLY", interval: 2, days: [1, 3], endsAt: "" });
    expect(screen.getByText("Every 2 weeks · Mon, Wed")).toBeInTheDocument();
  });

  it("does not show the interval row when pattern is NONE", () => {
    renderControlled(EMPTY_REPEAT);
    expect(screen.queryByRole("button", { name: "Increase repeat interval" })).toBeNull();
    expect(screen.queryByText(/Every/i)).toBeNull();
  });

  it("resets to no repeat when the reset button is clicked", () => {
    const { onChange } = renderControlled({ pattern: "MONTHLY", interval: 1, days: [], endsAt: "2026-12-31" });
    fireEvent.click(screen.getByRole("button", { name: "Remove repeat" }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ pattern: "NONE", interval: 1 }));
  });
});
