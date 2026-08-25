import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createWrapper } from "@/tests/utils/renderWithProviders";
import { AiCommentAssist } from "@/components/ai/AiCommentAssist";
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mock/server";

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import toast from "react-hot-toast";

const onAssist = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

function renderAssist(text = "check the pr please") {
  return render(
    <AiCommentAssist text={text} workspaceId="ws-1" onAssist={onAssist} />,
    { wrapper: createWrapper() },
  );
}

async function rewrite() {
  fireEvent.click(screen.getByRole("button", { name: /Rewrite/ }));
  fireEvent.click(screen.getByRole("menuitem", { name: /Professional/ }));
}

describe("AiCommentAssist", () => {
  it("applies the rewritten comment on success", async () => {
    renderAssist();

    await rewrite();

    await waitFor(() => expect(onAssist).toHaveBeenCalled());
    expect(onAssist.mock.calls[0][0]).toContain("pull request");
  });

  it("shows the workspace-scoped upgrade CTA on a daily quota error", async () => {
    server.use(
      http.post("*/api/v1/ai/comments/assist", () =>
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

    renderAssist();

    await rewrite();

    await waitFor(() => {
      expect(screen.getByText(/Upgrade for more AI/)).toBeInTheDocument();
    });

    const upgradeLink = screen.getByRole("link", { name: /Upgrade for more AI/ });
    expect(upgradeLink.getAttribute("href")).toBe(
      "/dashboard/workspaces/test-ws/billing/upgrade",
    );
  });

  it("shows the upgrade CTA on a feature-gate error", async () => {
    server.use(
      http.post("*/api/v1/ai/comments/assist", () =>
        HttpResponse.json(
          {
            success: false,
            code: "AI_FEATURE_NOT_AVAILABLE",
            message: "Not available on the PRO plan.",
            plan: "PRO",
          },
          { status: 403 },
        ),
      ),
    );

    renderAssist();

    await rewrite();

    const upgradeLink = await screen.findByRole("link", {
      name: /Upgrade for more AI/,
    });
    expect(upgradeLink.getAttribute("href")).toBe(
      "/dashboard/workspaces/test-ws/billing/upgrade",
    );
  });

  it("shows a transient notice (no dead-end link) on a service error", async () => {
    server.use(
      http.post("*/api/v1/ai/comments/assist", () =>
        HttpResponse.json(
          {
            success: false,
            code: "AI_SERVICE_UNAVAILABLE",
            message: "Gemini is down",
          },
          { status: 503 },
        ),
      ),
    );

    renderAssist();

    await rewrite();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByText(/couldn't rewrite right now/)).toBeInTheDocument();
    expect(screen.queryByText(/Upgrade for more AI/)).not.toBeInTheDocument();
    expect(onAssist).not.toHaveBeenCalled();
  });

  it("shows a friendly retry toast when the AI provider rate-limits", async () => {
    server.use(
      http.post("*/api/v1/ai/comments/assist", () =>
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

    renderAssist();

    await rewrite();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("too many requests"),
      );
    });
  });
});
