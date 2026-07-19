import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("lucide-react", () => ({
  Loader2: (props: any) => <svg data-testid="icon-Loader2" {...props} />,
}));

vi.mock("axios", () => ({
  default: { get: vi.fn().mockResolvedValue({ data: { jobs: [] } }) },
}));

vi.mock("@/components/Careers/CareersFilters", () => ({
  CareersFilters: () => <div data-testid="careers-filters" />,
}));

vi.mock("@/components/Careers/CareersJobCard", () => ({
  CareersJobCard: () => <div data-testid="careers-job-card" />,
}));

vi.mock("@/components/Careers/CareersEmpty", () => ({
  CareersEmpty: () => <div data-testid="careers-empty" />,
}));

vi.mock("@/components/Careers/CareersApplyModal", () => ({
  CareersApplyModal: () => <div data-testid="careers-apply-modal" />,
}));

vi.mock("@/components/Careers/CareersJobDetailModal", () => ({
  CareersJobDetailModal: () => <div data-testid="careers-detail-modal" />,
}));

import CareersJobList from "@/components/Careers/CareersJobList";

describe("CareersJobList", () => {
  it("renders loading state initially", () => {
    render(<CareersJobList />);
    expect(screen.getByTestId("icon-Loader2")).toBeInTheDocument();
  });

  it("renders the CareersEmpty component when no jobs", async () => {
    render(<CareersJobList />);
    // After fetch resolves with empty jobs, CareersEmpty should appear
    const { waitFor } = await import("@testing-library/react");
    await waitFor(() => {
      expect(screen.getByTestId("careers-empty")).toBeInTheDocument();
    });
  });
});
