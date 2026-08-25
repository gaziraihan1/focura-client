import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AiWeeklyInsights } from "@/components/ai/AiWeeklyInsights";
import { mockWorkspace } from "@/tests/mock/handlers/workspace.handlers";

function renderCard(workspaceId?: string | null) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <AiWeeklyInsights workspaceId={workspaceId} />
    </QueryClientProvider>,
  );
}

describe("AiWeeklyInsights", () => {
  it("renders the summary, highlights and risk severity labels", async () => {
    renderCard("ws-1");

    fireEvent.click(screen.getByText("Generate weekly insights"));

    await waitFor(() => {
      expect(screen.getByText(/Strong week/)).toBeInTheDocument();
    });

    expect(screen.getByText("12 tasks completed")).toBeInTheDocument();
    expect(screen.getByText("What went well")).toBeInTheDocument();
    expect(screen.getByText("Watch out for")).toBeInTheDocument();
    expect(screen.getByText("High risk")).toBeInTheDocument();
    expect(screen.getByText("Medium risk")).toBeInTheDocument();
    expect(screen.getByText(/Alice has 9 open tasks/)).toBeInTheDocument();
  });

  it("shows the Business upgrade CTA on a feature-gate error", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.post("*/api/v1/ai/insights/weekly", () =>
        HttpResponse.json(
          {
            success: false,
            code: "AI_FEATURE_NOT_AVAILABLE",
            message: "Not available on the PRO plan. Upgrade to unlock it.",
            plan: "PRO",
          },
          { status: 403 },
        ),
      ),
    );

    renderCard("ws-1");

    fireEvent.click(screen.getByText("Generate weekly insights"));

    await waitFor(() => {
      expect(screen.getByText(/AI assistant limit reached/)).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Weekly AI insights are a Business feature/),
    ).toBeInTheDocument();
  });

  it("links the upgrade CTA to the workspace billing page", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.post("*/api/v1/ai/insights/weekly", () =>
        HttpResponse.json(
          {
            success: false,
            code: "AI_FEATURE_NOT_AVAILABLE",
            message: "Business required",
            plan: "FREE",
          },
          { status: 403 },
        ),
      ),
    );

    renderCard("ws-1");

    fireEvent.click(screen.getByText("Generate weekly insights"));

    const upgradeLink = await screen.findByRole("link", { name: /Upgrade plan/ });
    expect(upgradeLink.getAttribute("href")).toBe(
      "/dashboard/workspaces/test-ws/billing/upgrade",
    );
  });

  it("shows a workspace picker on personal pages and switches the analyzed workspace", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.get("*/api/v1/workspaces", () =>
        HttpResponse.json({
          success: true,
          data: [
            { ...mockWorkspace, id: "ws-free", name: "Free Workspace", slug: "free-ws", plan: "FREE" },
            { ...mockWorkspace, id: "ws-biz", name: "Business Workspace", slug: "biz-ws", plan: "BUSINESS" },
          ],
        }),
      ),
    );

    renderCard(undefined);

    await waitFor(() => {
      expect(screen.getByLabelText("Workspace")).toBeInTheDocument();
    });

    // Prefers the Business workspace by default.
    expect(screen.getByText(/Productivity & burnout signals for Business Workspace/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Workspace"), {
      target: { value: "ws-free" },
    });

    expect(screen.getByText(/Productivity & burnout signals for Free Workspace/)).toBeInTheDocument();
  });

  it("surfaces a friendly message when the AI service fails", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.post("*/api/v1/ai/insights/weekly", () =>
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

    renderCard("ws-1");

    fireEvent.click(screen.getByText("Generate weekly insights"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByText(/couldn't generate insights right now/)).toBeInTheDocument();
  });

  it("shows the quota upgrade CTA on quota errors", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.post("*/api/v1/ai/insights/weekly", () =>
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

    renderCard("ws-1");

    fireEvent.click(screen.getByText("Generate weekly insights"));

    await waitFor(() => {
      expect(screen.getByText(/AI assistant limit reached/)).toBeInTheDocument();
    });
  });

  it("shows the upgrade CTA on a monthly token quota error", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.post("*/api/v1/ai/insights/weekly", () =>
        HttpResponse.json(
          {
            success: false,
            code: "AI_MONTHLY_QUOTA_EXCEEDED",
            message: "Monthly AI token limit reached.",
            plan: "PRO",
            retryAfter: 86400,
          },
          { status: 429 },
        ),
      ),
    );

    renderCard("ws-1");

    fireEvent.click(screen.getByText("Generate weekly insights"));

    await waitFor(() => {
      expect(screen.getByText(/AI assistant limit reached/)).toBeInTheDocument();
    });
  });

  it("renders a hint when the user is in no workspace", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.get("*/api/v1/workspaces", () =>
        HttpResponse.json({ success: true, data: [] }),
      ),
    );

    renderCard(undefined);

    await waitFor(() => {
      expect(
        screen.getByText(/Join a workspace to get an AI-powered summary/),
      ).toBeInTheDocument();
    });
  });

  it("shows a retry notice when the AI provider rate-limits", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.post("*/api/v1/ai/insights/weekly", () =>
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

    renderCard("ws-1");

    fireEvent.click(screen.getByText("Generate weekly insights"));

    await waitFor(() => {
      expect(
        screen.getByText(/The AI provider is busy right now/i),
      ).toBeInTheDocument();
    });
  });
});
