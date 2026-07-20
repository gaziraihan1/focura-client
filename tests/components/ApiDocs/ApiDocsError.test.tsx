import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ApiDocsErrors } from "@/components/ApiDocs/ApiDocsError";

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />;
    C.displayName = name;
    return C;
  };
  return { AlertCircle: icon("AlertCircle") };
});

describe("ApiDocsErrors", () => {
  it("renders the section heading", () => {
    render(<ApiDocsErrors />);
    expect(screen.getByText("Errors")).toBeInTheDocument();
  });

  it("renders HTTP status codes table", () => {
    render(<ApiDocsErrors />);
    expect(screen.getByText("HTTP Status Codes")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("renders error response shape and machine-readable codes", () => {
    render(<ApiDocsErrors />);
    expect(screen.getByText("Error Response Shape")).toBeInTheDocument();
    expect(screen.getByText("Machine-readable Error Codes")).toBeInTheDocument();
    expect(screen.getByText("VALIDATION_ERROR")).toBeInTheDocument();
    expect(screen.getByText("TOO_MANY_REQUESTS")).toBeInTheDocument();
  });
});
