import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { createWrapper } from "../../utils/renderWithProviders";
import { AiQuotaBadge } from "@/components/AI/AiQuotaBadge";
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mock/server";

describe("AiQuotaBadge", () => {
  it("renders the remaining credits once the quota loads", async () => {
    render(<AiQuotaBadge />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/57/)).toBeInTheDocument();
    });
    expect(screen.getByText("/ 60")).toBeInTheDocument();
  });

  it("uses the workspace quota when a workspaceId is provided", async () => {
    render(<AiQuotaBadge workspaceId="ws-1" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/57/)).toBeInTheDocument();
    });
  });

  it("renders nothing when the quota cannot be loaded", async () => {
    server.use(
      http.get("*/api/v1/ai/quota", () =>
        HttpResponse.json({ success: false, message: "down" }, { status: 503 }),
      ),
    );

    const { container } = render(<AiQuotaBadge />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});
