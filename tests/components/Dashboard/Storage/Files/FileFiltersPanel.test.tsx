import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FileFiltersPanel from "@/components/Dashboard/Storage/Files/FileFiltersPanel";

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />;
    C.displayName = name;
    return C;
  };
  return { ArrowUpDown: icon("ArrowUpDown"), X: icon("X") };
});

const defaultProps = {
  showFilters: true,
  onFiltersChange: vi.fn(),
  filters: { search: "", fileType: "all", uploadedBy: "all", sortBy: "date" as const, sortOrder: "desc" as const, page: 1 },
  isAdmin: false,
  uploaders: [],
  activeFilterCount: 0,
};

describe("FileFiltersPanel", () => {
  it("renders filter panel when showFilters is true", () => {
    render(<FileFiltersPanel {...defaultProps} />);
    expect(screen.getByText("File Type")).toBeInTheDocument();
    expect(screen.getByText("Sort By")).toBeInTheDocument();
    expect(screen.getByText("Order")).toBeInTheDocument();
  });

  it("does not render when showFilters is false", () => {
    render(<FileFiltersPanel {...defaultProps} showFilters={false} />);
    expect(screen.queryByText("File Type")).not.toBeInTheDocument();
  });

  it("renders uploader filter only for admins with uploaders", () => {
    render(<FileFiltersPanel {...defaultProps} isAdmin={true} uploaders={[{ id: "u1", name: "Alice", email: "a@b.com", fileCount: 5 }]} />);
    expect(screen.getByText("Uploaded By")).toBeInTheDocument();
  });

  it("renders clear button when active filters exist", () => {
    render(<FileFiltersPanel {...defaultProps} activeFilterCount={2} />);
    expect(screen.getByText("Clear All Filters")).toBeInTheDocument();
  });
});
