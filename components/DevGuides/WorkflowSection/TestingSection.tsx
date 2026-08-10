"use client";

import type { GuideArticle } from "@/types/guides.types";
import { CodeBlock, IC, Prose, RowList, SectionH, Warn } from "../";

export const testingArticles: GuideArticle[] = [
  {
    id: "test-stack",
    title: "Test stack",
    summary:
      "Vitest + React Testing Library + MSW. Tests live in tests/ mirroring the hooks/ folder structure.",
    content: (
      <Prose>
        The frontend test suite uses Vitest + React Testing Library + MSW. Tests live in{" "}
        <IC>tests/</IC> and follow the same folder structure as <IC>hooks/</IC>.
      </Prose>
    ),
  },
  {
    id: "key-setup-decisions",
    title: "Key setup decisions",
    summary:
      "Pin jsdom to v24, polyfill TransformStream for MSW, mock lib/axios entirely, and configure path aliases in vitest.config.ts.",
    content: (
      <>
        <SectionH>Key setup decisions</SectionH>
        <RowList
          items={[
            { label: "jsdom pinned to v24", desc: "jsdom v25+ breaks ESM compatibility — always pin: \"jsdom\": \"24\"" },
            { label: "MSW TransformStream", desc: "Polyfill TransformStream in vitest.setup.ts to fix MSW worker init in jsdom" },
            { label: "lib/axios mocked", desc: "Mock the entire lib/axios module — never let real HTTP calls through in tests" },
            { label: "Path aliases", desc: "Configure vite resolve.alias in vitest.config.ts to match tsconfig paths" },
          ]}
        />
      </>
    ),
  },
  {
    id: "test-setup-file",
    title: "Test setup file",
    summary:
      "tests/setup.ts polyfills TransformStream and wires up the MSW server with beforeAll, afterEach and afterAll hooks.",
    content: (
      <>
        <SectionH>Test setup file</SectionH>
        <CodeBlock label="tests/setup.ts">{`import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./mocks/server";

// Polyfill for MSW in jsdom
if (typeof TransformStream === "undefined") {
  global.TransformStream = require("web-streams-polyfill").TransformStream;
}

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());`}</CodeBlock>
      </>
    ),
  },
  {
    id: "mock-axios-instance",
    title: "Mock the Axios instance",
    summary:
      "vi.mock lib/axios in every test that makes API calls, providing get, post, put and delete stubs.",
    content: (
      <>
        <SectionH>Mock the Axios instance</SectionH>
        <CodeBlock label="tests/mocks/axios.ts">{`// vi.mock this file in every test that uses API calls
vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));`}</CodeBlock>
      </>
    ),
  },
  {
    id: "create-wrapper-pattern",
    title: "createWrapper — cache seeding pattern",
    summary:
      "A reusable QueryClientProvider wrapper with retry disabled, plus cache seeding via setQueryData before rendering hooks.",
    content: (
      <>
        <SectionH>createWrapper — cache seeding pattern</SectionH>
        <CodeBlock label="tests/utils/createWrapper.tsx">{`export function createWrapper(client?: QueryClient) {
  const qc = client ?? new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

// In tests: seed initial cache state before rendering
qc.setQueryData(taskKeys.lists(workspaceId), mockTasks);
const { result } = renderHook(() => useTasks(workspaceId), {
  wrapper: createWrapper(qc),
});`}</CodeBlock>
      </>
    ),
  },
  {
    id: "mutation-testing-pattern",
    title: "Mutation testing pattern",
    summary:
      "Call mutate() inside act() and waitFor() outside it — never use mutateAsync inside act() or you get unhandled promise rejections.",
    content: (
      <>
        <SectionH>Mutation testing pattern</SectionH>
        <CodeBlock label="tests/hooks/useCreateTask.test.ts">{`it("creates a task and invalidates the list cache", async () => {
  const { result } = renderHook(() => useCreateTask(workspaceId), {
    wrapper: createWrapper(),
  });

  // Call mutate() inside act()
  act(() => {
    result.current.mutate({ title: "New task", status: "TODO" });
  });

  // waitFor() outside act()
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
});`}</CodeBlock>

        <Warn>
          Never use <IC>mutateAsync</IC> inside <IC>act()</IC> — it causes unhandled promise
          rejection in the test runner. Use <IC>mutate()</IC> inside <IC>act()</IC> and{" "}
          <IC>waitFor()</IC> outside.
        </Warn>
      </>
    ),
  },
];
