import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserContributionsTable } from "@/components/Dashboard/Storage/UserContributionsTable";

vi.mock("framer-motion", () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
  },
}));

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />;
    C.displayName = name;
    return C;
  };
  return { Users: icon("Users"), Crown: icon("Crown"), User: icon("User"), TrendingUp: icon("TrendingUp") };
});

vi.mock("@/hooks/useStorage", () => ({
  UserContribution: {},
}));

vi.mock("@/hooks/useStoragePage", () => ({
  formatStorageSize: (mb: number) => `${mb} MB`,
}));

const mockContributions = [
  { userId: "1", userName: "Alice", userEmail: "alice@test.com", usageMB: 500, fileCount: 10, percentage: 60 },
  { userId: "2", userName: "Bob", userEmail: "bob@test.com", usageMB: 200, fileCount: 5, percentage: 25 },
];

describe("UserContributionsTable", () => {
  it("renders the heading and member count", () => {
    render(<UserContributionsTable contributions={mockContributions} totalStorageMB={700} />);
    expect(screen.getByText("Team Storage Usage")).toBeInTheDocument();
    expect(screen.getByText("2 members")).toBeInTheDocument();
  });

  it("renders user names and emails", () => {
    render(<UserContributionsTable contributions={mockContributions} totalStorageMB={700} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("shows empty state when no contributions", () => {
    render(<UserContributionsTable contributions={[]} totalStorageMB={0} />);
    expect(screen.getByText("No team members found")).toBeInTheDocument();
  });

  it("renders total team storage", () => {
    render(<UserContributionsTable contributions={mockContributions} totalStorageMB={700} />);
    expect(screen.getByText("Total Team Storage")).toBeInTheDocument();
    expect(screen.getByText("700 MB")).toBeInTheDocument();
  });
});
