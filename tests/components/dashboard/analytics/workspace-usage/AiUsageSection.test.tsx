import {
  afterEach,
  describe,
  it,
  expect,
  vi,
} from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AiUsageSection } from "@/components/dashboard/analytics/WorkspaceUsage/AiUsageSection";

function renderSection() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <AiUsageSection workspaceId="ws-1" />
    </QueryClientProvider>,
  );
}

/** Reads a Blob's text via FileReader (jsdom Blob has no .text()). */
function readBlobText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("readBlobText failed"));
    reader.readAsText(blob);
  });
}

/** Spies on the Blob-download flow and captures the anchor element. */
function spyDownloads() {
  const createObjectURL = vi
    .spyOn(URL, "createObjectURL")
    .mockImplementation(() => "blob:mock");
  const revokeObjectURL = vi
    .spyOn(URL, "revokeObjectURL")
    .mockImplementation(() => {});
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

  let captured: HTMLAnchorElement | null = null;
  const originalCreateElement = document.createElement.bind(document);
  vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
    const el = originalCreateElement(tag);
    if (tag.toLowerCase() === "a") captured = el as HTMLAnchorElement;
    return el;
  });

  return {
    createObjectURL,
    revokeObjectURL,
    getAnchor: () => captured,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AiUsageSection", () => {
  it("renders totals, feature breakdown and recent calls", async () => {
    renderSection();

    await waitFor(() => {
      expect(screen.getByText("AI Usage")).toBeInTheDocument();
    });

    expect(screen.getByText("AI calls")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Tokens used")).toBeInTheDocument();
    expect(screen.getByText("Estimated cost")).toBeInTheDocument();
    expect(screen.getByText("Calls by feature")).toBeInTheDocument();
    expect(screen.getByText("Calls by model")).toBeInTheDocument();
    // "lite" appears in both the model chip and the recent-calls table.
    expect(screen.getAllByText("lite").length).toBeGreaterThan(0);
    // The feature appears in both the breakdown list and the recent-calls table.
    expect(screen.getAllByText("Task autocomplete").length).toBeGreaterThan(0);
    expect(screen.getByText("Recent calls")).toBeInTheDocument();
    expect(screen.getAllByText("Goal breakdown").length).toBeGreaterThan(0);
  });

  it("shows the effective AI limits card with usage bars", async () => {
    renderSection();

    await waitFor(() => {
      expect(screen.getByText("Current AI limits")).toBeInTheDocument();
    });

    // FREE mock: no admin overrides → no "custom" hints, plan default shown.
    expect(screen.getByText("FREE plan")).toBeInTheDocument();
    expect(screen.getByText("Calls per day")).toBeInTheDocument();
    expect(screen.getByText("Monthly tokens")).toBeInTheDocument();
    expect(screen.getByText(/Rate & response/)).toBeInTheDocument();
    expect(screen.getByText(/3\/min · 15\/hr · 512 tokens\/response/)).toBeInTheDocument();
    expect(screen.queryByText(/customized by Gablura admin/i)).not.toBeInTheDocument();
  });

  it("flags admin-raised caps with the plan default alongside", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.get("*/api/v1/ai/quota", () =>
        HttpResponse.json({
          success: true,
          data: {
            plan: "ENTERPRISE",
            dailyLimit: 10000,
            usedToday: 42,
            remaining: 9958,
            burstPerMinute: 30,
            hourly: 200,
            dailyTokens: 2000000,
            monthlyTokens: 50000000,
            maxOutputTokens: 4096,
            tokensUsedToday: 4200,
            tokensUsedThisMonth: 500000,
            features: ["*"],
            resetAt: "2026-08-12T00:00:00.000Z",
            defaults: {
              daily: 2000,
              monthlyTokens: 25000000,
              maxOutputTokens: 2048,
            },
            overrides: {
              daily: 10000,
              monthlyTokens: 50000000,
              maxOutputTokens: 4096,
            },
          },
        }),
      ),
    );

    renderSection();

    await waitFor(() => {
      expect(screen.getByText("Current AI limits")).toBeInTheDocument();
    });

    expect(screen.getByText("ENTERPRISE plan")).toBeInTheDocument();
    // The raised caps are surfaced with the tier default for comparison.
    expect(screen.getByText("Customized by Gablura admin")).toBeInTheDocument();
    expect(screen.getAllByText(/Plan default:/).length).toBeGreaterThan(0);
    expect(screen.getByText(/10,000/)).toBeInTheDocument();
    expect(screen.getByText(/2,000/)).toBeInTheDocument();
  });

  it("switches the period with the 7d/30d/90d buttons", async () => {
    renderSection();

    await waitFor(() => {
      expect(screen.getByText(/Last 30 days/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("7d"));

    await waitFor(() => {
      expect(screen.getByText(/Last 7 days/)).toBeInTheDocument();
    });
  });

  it("exports the report as CSV", async () => {
    const downloads = spyDownloads();
    renderSection();

    await waitFor(() => {
      expect(screen.getByText(/Last 30 days/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Export/ }));
    fireEvent.click(screen.getByText("Export as CSV"));

    await waitFor(() => {
      expect(downloads.getAnchor()?.download).toContain("ai-usage-30d-");
    });
    expect(downloads.getAnchor()?.download).toMatch(/.csv$/);

    const blob = downloads.createObjectURL.mock.calls[0][0] as Blob;
    const text = await readBlobText(blob);
    expect(text).toContain("Section,Field,Value");
    expect(text).toContain("Task autocomplete");
    expect(text).toContain("Recent Calls");
    expect(downloads.revokeObjectURL).toHaveBeenCalledWith("blob:mock");
  });

  it("exports the report as JSON", async () => {
    const downloads = spyDownloads();
    renderSection();

    await waitFor(() => {
      expect(screen.getByText(/Last 30 days/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Export/ }));
    fireEvent.click(screen.getByText("Export as JSON"));

    await waitFor(() => {
      expect(downloads.getAnchor()?.download).toMatch(/.json$/);
    });

    const blob = downloads.createObjectURL.mock.calls[0][0] as Blob;
    const parsed = JSON.parse(await readBlobText(blob));
    expect(parsed.total.calls).toBe(12);
    expect(parsed.byFeature).toHaveLength(3);
  });

  it("renders an empty state when there is no usage", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("@/tests/mock/server");

    server.use(
      http.get("*/api/v1/ai/usage", () =>
        HttpResponse.json({
          success: true,
          data: {
            workspaceId: "ws-1",
            days: 30,
            period: { start: "2026-07-11T00:00:00.000Z", end: "2026-08-10T00:00:00.000Z" },
            total: { calls: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0 },
            byFeature: [],
            byModel: [],
            recent: [],
          },
        }),
      ),
    );

    renderSection();

    await waitFor(() => {
      expect(screen.getByText("No AI usage yet")).toBeInTheDocument();
    });
  });
});
