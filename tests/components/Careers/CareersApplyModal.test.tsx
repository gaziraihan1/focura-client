import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("lucide-react", () => {
  const icon = (name: string) => (props: any) => <svg data-testid={`icon-${name}`} {...props} />;
  return {
    X: icon("X"),
    MapPin: icon("MapPin"),
    Clock: icon("Clock"),
    Briefcase: icon("Briefcase"),
    ExternalLink: icon("ExternalLink"),
    Mail: icon("Mail"),
    ChevronRight: icon("ChevronRight"),
  };
});

vi.mock("@/types/job.types", () => ({
  DEPARTMENT_LABELS: { ENGINEERING: "Engineering" },
  LOCATION_LABELS: { REMOTE: "Remote" },
  TYPE_LABELS: { FULL_TIME: "Full-time" },
  EXPERIENCE_LABELS: { MID: "Mid Level" },
}));

import { CareersApplyModal } from "@/components/Careers/CareersApplyModal";

const mockJob = {
  id: "j1",
  title: "Frontend Dev",
  slug: "frontend-dev",
  department: "ENGINEERING",
  location: "Remote",
  locationType: "REMOTE",
  type: "FULL_TIME",
  experienceLevel: "MID",
  status: "OPEN" as const,
  salaryMin: null,
  salaryMax: null,
  salaryCurrency: "USD",
  description: "Desc",
  requirements: "Req",
  niceToHave: null,
  benefits: null,
  isPinned: false,
  closingDate: null,
  publishedAt: "2026-01-01T00:00:00Z",
  applicationUrl: null,
  applicationEmail: "hr@example.com",
};

describe("CareersApplyModal", () => {
  it("returns null when job is null", () => {
    const { container } = render(<CareersApplyModal job={null} onClose={vi.fn()} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders job title and department", () => {
    render(<CareersApplyModal job={mockJob} onClose={vi.fn()} />);
    expect(screen.getByText("Frontend Dev")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
  });

  it("renders apply via email link", () => {
    render(<CareersApplyModal job={mockJob} onClose={vi.fn()} />);
    expect(screen.getByText("Apply via email")).toBeInTheDocument();
  });

  it("renders what-to-include section", () => {
    render(<CareersApplyModal job={mockJob} onClose={vi.fn()} />);
    expect(screen.getByText("What to include in your email")).toBeInTheDocument();
  });
});
