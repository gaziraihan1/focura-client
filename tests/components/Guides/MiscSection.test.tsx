import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("lucide-react", () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />;
  return {
    Shield: icon("Shield"),
    Settings2: icon("Settings2"),
    CreditCard: icon("CreditCard"),
    FileText: icon("FileText"),
  };
});

vi.mock("@/lib/utils", () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(" "),
}));

vi.mock("@/constants/guides.constants", () => ({
  COLOR_MAP: { slate: { pill: "bg-slate-100" } },
}));

import { BillingSection, VotingSection, MeetingsSection } from "@/components/Guides/MiscSection";

describe("BillingSection", () => {
  it("renders billing heading", () => {
    render(<BillingSection />);
    expect(screen.getByText("Accessing billing")).toBeInTheDocument();
  });

  it("renders plan changing steps", () => {
    render(<BillingSection />);
    expect(screen.getByText("Changing your plan")).toBeInTheDocument();
  });

  it("renders invoices section", () => {
    render(<BillingSection />);
    expect(screen.getByText("Invoices")).toBeInTheDocument();
  });
});

describe("VotingSection", () => {
  it("renders feature voting heading", () => {
    render(<VotingSection />);
    expect(screen.getByText("What is Feature Voting?")).toBeInTheDocument();
  });

  it("renders voting tips section", () => {
    render(<VotingSection />);
    expect(screen.getByText("Voting tips")).toBeInTheDocument();
  });
});

describe("MeetingsSection", () => {
  it("renders meetings heading", () => {
    render(<MeetingsSection />);
    expect(screen.getByText("What are meetings?")).toBeInTheDocument();
  });

  it("renders scheduling section", () => {
    render(<MeetingsSection />);
    expect(screen.getByText("Scheduling a meeting")).toBeInTheDocument();
  });
});
