import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("lucide-react", () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />;
  return {
    Plus: icon("Plus"),
    X: icon("X"),
    Loader2: icon("Loader2"),
    AlertTriangle: icon("AlertTriangle"),
  };
});

vi.mock("@/hooks/useJob", () => ({
  useAdminJobs: () => ({ data: { jobs: [] }, isPending: false, isError: false, refetch: vi.fn() }),
  useCreateJob: () => ({ mutateAsync: vi.fn() }),
  useUpdateJob: () => ({ mutateAsync: vi.fn() }),
  useDeleteJob: () => ({ mutateAsync: vi.fn() }),
  useToggleJobPin: () => ({ mutate: vi.fn() }),
  useToggleJobStatus: () => ({ mutate: vi.fn() }),
}));

vi.mock("@/components/AdminDashboard/careers/AdminJobTable", () => ({
  default: () => <div data-testid="admin-job-table" />,
}));

vi.mock("@/components/AdminDashboard/careers/AdminJobForm", () => ({
  AdminJobForm: () => <form data-testid="admin-job-form" />,
}));

vi.mock("@/lib/utils", () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(" "),
}));

import AdminJobManager from "@/components/AdminDashboard/careers/AdminJobManager";

describe("AdminJobManager", () => {
  it("renders the header title", () => {
    render(<AdminJobManager />);
    expect(screen.getByText("Job Postings")).toBeInTheDocument();
  });

  it("renders New Role button", () => {
    render(<AdminJobManager />);
    expect(screen.getByText("New Role")).toBeInTheDocument();
  });

  it("renders the job table when data loads", () => {
    render(<AdminJobManager />);
    expect(screen.getByTestId("admin-job-table")).toBeInTheDocument();
  });
});
