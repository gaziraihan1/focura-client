"use client"
import { CodeBlock, IC, Prose, RowList, SectionH, Warn } from "../";

export function TestingSection() {
  return (
    <div>
      <Prose>
        The frontend test suite uses Vitest + React Testing Library + MSW. Tests live in <IC>tests/</IC> and follow the same folder structure as <IC>hooks/</IC>.
      </Prose>

      <SectionH>Key setup decisions</SectionH>
      <RowList items={[
        { label: "jsdom pinned to v24", desc: "jsdom v25+ breaks ESM compatibility — always pin: \"jsdom\": \"24\"" },
        { label: "MSW TransformStream", desc: "Polyfill TransformStream in vitest.setup.ts to fix MSW worker init in jsdom" },
        { label: "lib/axios mocked", desc: "Mock the entire lib/axios module — never let real HTTP calls through in tests" },
        { label: "Path aliases", desc: "Configure vite resolve.alias in vitest.config.ts to match tsconfig paths" },
      ]} />

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
        Never use <IC>mutateAsync</IC> inside <IC>act()</IC> — it causes unhandled promise rejection in the test runner. Use <IC>mutate()</IC> inside <IC>act()</IC> and <IC>waitFor()</IC> outside.
      </Warn>
    </div>
  );
}