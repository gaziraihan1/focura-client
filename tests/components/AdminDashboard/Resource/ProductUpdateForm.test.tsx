import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("lucide-react", () => ({
  Loader2: (props: any) => <svg data-testid="icon-Loader2" {...props} />,
}));

vi.mock("@/hooks/useResource", () => ({
  useCreateProductUpdate: () => ({ mutateAsync: vi.fn(), isPending: false, error: null }),
  useUpdateProductUpdate: () => ({ mutateAsync: vi.fn(), isPending: false, error: null }),
}));

import { ProductUpdateForm } from "@/components/AdminDashboard/Resource/ProductUpdateForm";

describe("ProductUpdateForm", () => {
  it("renders all form fields", () => {
    render(<ProductUpdateForm />);
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Version")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("renders submit button with create label", () => {
    render(<ProductUpdateForm />);
    expect(screen.getByText("Save product update")).toBeInTheDocument();
  });

  it("renders StatusSelect with its label", () => {
    render(<ProductUpdateForm />);
    expect(screen.getByText("Status")).toBeInTheDocument();
  });
});
