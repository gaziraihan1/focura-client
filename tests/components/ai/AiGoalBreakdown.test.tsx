import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// ─── react-hot-toast is used by the component — mock it so we can assert ─────
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { AiGoalBreakdown } from "@/components/ai/AiGoalBreakdown";
import toast from "react-hot-toast";

function renderCard() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <AiGoalBreakdown />
    </QueryClientProvider>,
  );
}

function typeGoal() {
  fireEvent.change(screen.getByLabelText("Your goal"), {
    target: { value: "Launch a personal blog by the end of the month" },
  });
}

describe("AiGoalBreakdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders suggested steps after a successful breakdown", async () => {
    renderCard();
    typeGoal();
    fireEvent.click(screen.getByText("Generate plan"));

    await waitFor(() => {
      expect(screen.getByText("Suggested steps")).toBeInTheDocument();
    });
    expect(screen.getByText("Outline the blog structure")).toBeInTheDocument();
  });

  it("shows a friendly retry toast when the AI provider rate-limits", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.post("*/api/v1/ai/goals/breakdown", () =>
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

    renderCard();
    typeGoal();
    fireEvent.click(screen.getByText("Generate plan"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("too many requests"),
      );
    });
  });
});
