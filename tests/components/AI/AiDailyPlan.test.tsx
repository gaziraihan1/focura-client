import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { AiDailyPlan } from "@/components/AI/AiDailyPlan";

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import toast from "react-hot-toast";

function wrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

const TASKS = [
  { id: "t1", title: "Fix login bug", priority: "URGENT", energyType: "HIGH" },
  { id: "t2", title: "Reply to emails", priority: "LOW", energyType: "LOW" },
];

describe("AiDailyPlan", () => {
  it("renders nothing with fewer than 2 tasks", () => {
    const { container } = render(
      <AiDailyPlan tasks={[{ id: "t1", title: "Only one" }]} />,
      { wrapper: wrapper() },
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("generates and renders an ordered plan", async () => {
    render(<AiDailyPlan tasks={TASKS} />, { wrapper: wrapper() });

    fireEvent.click(screen.getByText("Generate order"));

    await waitFor(() => {
      expect(screen.getByText("Recommended order")).toBeInTheDocument();
    });

    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
    expect(screen.getByText("Reply to emails")).toBeInTheDocument();
    expect(screen.getByText(/Urgent and due today/)).toBeInTheDocument();
    expect(screen.getByText("Front-load the urgent work.")).toBeInTheDocument();
  });

  it("shows an upgrade CTA on quota errors", async () => {
    const { QueryClient, QueryClientProvider } = await import("@tanstack/react-query");
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.post("*/api/v1/ai/plan/daily", () =>
        HttpResponse.json(
          {
            success: false,
            code: "AI_DAILY_QUOTA_EXCEEDED",
            message: "You've hit the free AI limit.",
            plan: "FREE",
            retryAfter: 3600,
          },
          { status: 429 },
        ),
      ),
    );

    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={qc}>
        <AiDailyPlan tasks={TASKS} />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Generate order"));

    await waitFor(() => {
      expect(screen.getByText(/AI assistant limit reached/)).toBeInTheDocument();
    });
  });

  it("shows a friendly retry toast when the AI provider rate-limits", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.post("*/api/v1/ai/plan/daily", () =>
        HttpResponse.json(
          {
            success: false,
            code: "AI_PROVIDER_RATE_LIMIT",
            message:
              "The AI provider is receiving too many requests right now. Please try again in a moment.",
            retryAfter: 60,
          },
          { status: 429 },
        ),
      ),
    );

    render(<AiDailyPlan tasks={TASKS} />, { wrapper: wrapper() });

    fireEvent.click(screen.getByText("Generate order"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("too many requests"),
      );
    });
  });
});
