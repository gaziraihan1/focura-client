import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { createWrapper } from "../../utils/renderWithProviders";
import { AiSuggestionBar } from "@/components/AI/AiSuggestionBar";
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mock/server";
import type { AiTaskSuggestion } from "@/types/ai.types";

const onApply = vi.fn();
const onApplyPartial = vi.fn();

function renderBar(title: string) {
  return render(
    <AiSuggestionBar
      title={title}
      workspaceId={null}
      onApply={onApply}
      onApplyPartial={onApplyPartial}
    />,
    { wrapper: createWrapper() },
  );
}

describe("AiSuggestionBar", () => {
  it("renders nothing for very short titles", () => {
    const { container } = renderBar("ab");
    expect(container.firstChild).toBeNull();
  });

  it("renders suggestion chips and applies the full suggestion", async () => {
    renderBar("Fix login redirect");

    // Wait for the suggestion payload itself (chips), not just the header.
    await waitFor(() => {
      expect(screen.getByText("High")).toBeInTheDocument();
    });
    expect(screen.getByText("MEDIUM energy")).toBeInTheDocument();
    expect(screen.getByText("~2h")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Apply all/i }));

    expect(onApply).toHaveBeenCalledTimes(1);
    const suggestion = onApply.mock.calls[0][0] as AiTaskSuggestion;
    expect(suggestion.priority).toBe("HIGH");
    expect(suggestion.subtasks).toHaveLength(2);
  });

  it("applies a single field when a chip is clicked", async () => {
    renderBar("Fix login redirect");

    await waitFor(() => {
      expect(screen.getByText("High")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("High"));

    expect(onApplyPartial).toHaveBeenCalledWith({ priority: "HIGH" });
  });

  it("shows an upgrade CTA when the daily quota is exhausted", async () => {
    server.use(
      http.post("*/api/v1/ai/tasks/autocomplete", () =>
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

    renderBar("Fix login redirect");

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: /upgrade for more ai/i }),
      ).toBeInTheDocument();
    });
  });

  it("shows a graceful notice when the AI service is unavailable", async () => {
    server.use(
      http.post("*/api/v1/ai/tasks/autocomplete", () =>
        HttpResponse.json(
          { success: false, code: "AI_SERVICE_UNAVAILABLE", message: "down" },
          { status: 503 },
        ),
      ),
    );

    renderBar("Fix login redirect");

    await waitFor(() => {
      expect(
        screen.getByText(/AI is unavailable right now/i),
      ).toBeInTheDocument();
    });
  });
});
