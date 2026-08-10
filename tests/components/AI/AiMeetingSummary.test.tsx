import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AiMeetingSummary } from "@/components/AI/AiMeetingSummary";

function renderCard() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <AiMeetingSummary meetingId="m1" workspaceId="ws-1" />
    </QueryClientProvider>,
  );
}

describe("AiMeetingSummary", () => {
  it("renders summary + action items after generating", async () => {
    renderCard();

    fireEvent.click(screen.getByText("Summarize meeting"));

    await waitFor(() => {
      expect(screen.getByText("Summary")).toBeInTheDocument();
    });

    expect(screen.getByText(/Q3 roadmap/)).toBeInTheDocument();
    expect(screen.getByText(/Draft the Q3 budget/)).toBeInTheDocument();
    expect(screen.getByText("→ alice@example.com")).toBeInTheDocument();
  });

  it("shows an upgrade CTA on quota errors", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.post("*/api/v1/ai/meetings/summarize", () =>
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

    renderCard();

    fireEvent.click(screen.getByText("Summarize meeting"));

    await waitFor(() => {
      expect(screen.getByText(/AI assistant limit reached/)).toBeInTheDocument();
    });
  });
});
