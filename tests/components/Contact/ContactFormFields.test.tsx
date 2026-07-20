import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("react-hook-form", () => ({
  useWatch: () => "",
}));

vi.mock("lucide-react", () => ({
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-AlertCircle" {...props} />,
}));

vi.mock("@/lib/utils", () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(" "),
}));

import { FieldWrap, ContactFields } from "@/components/Contact/ContactFormFields";

describe("FieldWrap", () => {
  it("renders label and children", () => {
    render(
      <FieldWrap label="Name" htmlFor="name">
        <input id="name" />
      </FieldWrap>
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders required asterisk", () => {
    render(
      <FieldWrap label="Email" htmlFor="email" required>
        <input id="email" />
      </FieldWrap>
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders error message when provided", () => {
    render(
      <FieldWrap label="Field" htmlFor="f" error="Required field">
        <input id="f" />
      </FieldWrap>
    );
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });
});

describe("ContactFields", () => {
  const baseProps = {
    register: vi.fn(() => ({})),
    control: {},
    errors: {},
  };

  it("renders name and email inputs", () => {
    render(<ContactFields {...baseProps} />);
    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  });

  it("renders category select", () => {
    render(<ContactFields {...baseProps} />);
    expect(screen.getByText("General Enquiry")).toBeInTheDocument();
    expect(screen.getByText("Technical Issue")).toBeInTheDocument();
  });

  it("renders consent checkbox", () => {
    render(<ContactFields {...baseProps} />);
    expect(screen.getByText(/Privacy Policy/)).toBeInTheDocument();
  });
});
