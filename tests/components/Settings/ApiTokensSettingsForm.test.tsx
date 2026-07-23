/**
 * tests/components/Settings/ApiTokensSettingsForm.test.tsx
 *
 * Tests for API Tokens Settings Form component.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, userEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { ApiTokensSettingsForm } from "@/components/Settings/ApiTokensSettingsForm";

// Mock lucide-react
vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid={`icon-${name}`} {...props} />
    );
    C.displayName = name;
    return C;
  };
  return {
    KeyRound: icon("KeyRound"),
    Copy: icon("Copy"),
    Trash2: icon("Trash2"),
    Plus: icon("Plus"),
    Loader2: icon("Loader2"),
    Shield: icon("Shield"),
    Calendar: icon("Calendar"),
    BookOpen: icon("BookOpen"),
    Code: icon("Code"),
    AlertTriangle: icon("AlertTriangle"),
    ExternalLink: icon("ExternalLink"),
  };
});

// Mock the hooks
vi.mock("@/hooks/useApiTokens", () => ({
  useApiTokens: vi.fn(),
  useCreateApiToken: vi.fn(),
  useDeleteApiToken: vi.fn(),
  apiTokenKeys: { all: ["api-tokens"], list: () => ["api-tokens", "list"] },
}));

// Mock ConfirmModal
vi.mock("@/components/Shared/ConfirmModal", () => ({
  ConfirmModal: ({ isOpen, onConfirm, title }: any) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <span>{title}</span>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null,
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { useApiTokens, useCreateApiToken, useDeleteApiToken } from "@/hooks/useApiTokens";

// Test wrapper
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe("ApiTokensSettingsForm", () => {
  const mockTokens = [
    {
      id: "1",
      name: "CI/CD Pipeline",
      prefix: "foc_abc12345",
      lastUsedAt: "2024-01-15T10:00:00Z",
      expiresAt: null,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Personal Script",
      prefix: "foc_xyz78901",
      lastUsedAt: null,
      expiresAt: null,
      isActive: true,
      createdAt: "2024-01-10T00:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useApiTokens as any).mockReturnValue({
      data: mockTokens,
      isLoading: false,
    });
    (useCreateApiToken as any).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
    (useDeleteApiToken as any).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it("renders loading state", () => {
    (useApiTokens as any).mockReturnValue({
      data: [],
      isLoading: true,
    });

    render(createElement(ApiTokensSettingsForm), { wrapper: createWrapper() });

    expect(screen.getByTestId("icon-Loader2")).toBeInTheDocument();
  });

  it("renders empty state when no tokens", () => {
    (useApiTokens as any).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(createElement(ApiTokensSettingsForm), { wrapper: createWrapper() });

    expect(screen.getByText("No API tokens yet. Create one above to get started.")).toBeInTheDocument();
  });

  it("renders list of tokens", () => {
    render(createElement(ApiTokensSettingsForm), { wrapper: createWrapper() });

    expect(screen.getByText("CI/CD Pipeline")).toBeInTheDocument();
    expect(screen.getByText("Personal Script")).toBeInTheDocument();
    expect(screen.getByText("2 tokens configured")).toBeInTheDocument();
  });

  it("renders create form", () => {
    render(createElement(ApiTokensSettingsForm), { wrapper: createWrapper() });

    expect(screen.getByText("Create New Token")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g., CI/CD Pipeline, Personal Script")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("renders documentation section", () => {
    render(createElement(ApiTokensSettingsForm), { wrapper: createWrapper() });

    expect(screen.getByText("API Documentation")).toBeInTheDocument();
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Examples")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
  });
});
