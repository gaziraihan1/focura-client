import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HelpContactCards } from "@/components/Dashboard/help/HelpContactCards";

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: any) => <svg data-testid={`icon-${name}`} {...props} />;
    C.displayName = name;
    return C;
  };
  return { Mail: icon("Mail"), MessageCircle: icon("MessageCircle"), Bug: icon("Bug"), Sparkles: icon("Sparkles") };
});

vi.mock("@/lib/utils", () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

describe("HelpContactCards", () => {
  it("renders all four contact options", () => {
    render(<HelpContactCards />);
    expect(screen.getByText("Email support")).toBeInTheDocument();
    expect(screen.getByText("Live chat")).toBeInTheDocument();
    expect(screen.getByText("Bug report")).toBeInTheDocument();
    expect(screen.getByText("Feature request")).toBeInTheDocument();
  });

  it("calls onChatOpen when live chat button is clicked", () => {
    const onChatOpen = vi.fn();
    render(<HelpContactCards onChatOpen={onChatOpen} />);
    fireEvent.click(screen.getByText("Live chat").closest("button")!);
    expect(onChatOpen).toHaveBeenCalled();
  });

  it("calls onBugReport when bug report button is clicked", () => {
    const onBugReport = vi.fn();
    render(<HelpContactCards onBugReport={onBugReport} />);
    fireEvent.click(screen.getByText("Bug report").closest("button")!);
    expect(onBugReport).toHaveBeenCalled();
  });
});
