import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactInfo } from "@/components/Contact/ContactInfo";

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />;
    C.displayName = name;
    return C;
  };
  return {
    Mail: icon("Mail"),
    Clock: icon("Clock"),
    ShieldAlert: icon("ShieldAlert"),
    CreditCard: icon("CreditCard"),
    Wrench: icon("Wrench"),
    Lightbulb: icon("Lightbulb"),
    Handshake: icon("Handshake"),
  };
});

describe("ContactInfo", () => {
  it("renders all contact channel labels", () => {
    render(<ContactInfo />);
    expect(screen.getByText("General & Billing")).toBeInTheDocument();
    expect(screen.getByText("Security Issues")).toBeInTheDocument();
    expect(screen.getByText("Support Hours")).toBeInTheDocument();
  });

  it("renders category cards", () => {
    render(<ContactInfo />);
    expect(screen.getByText("Technical Issue")).toBeInTheDocument();
    expect(screen.getByText("Billing & Plans")).toBeInTheDocument();
    expect(screen.getByText("Feature Request")).toBeInTheDocument();
    expect(screen.getByText("Partnership")).toBeInTheDocument();
  });

  it("renders the SLA notice", () => {
    render(<ContactInfo />);
    expect(screen.getByText(/Auto-reply is instant/)).toBeInTheDocument();
  });
});
