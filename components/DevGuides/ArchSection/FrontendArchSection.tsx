"use client";

import { CodeBlock, FileTree, IC, Prose, RowList, SectionH, Tip } from "../";

export function FrontendArchSection() {
  return (
    <div>
      <Prose>
        The client follows a strict layered architecture. Logic lives in hooks — UI components are display-only. No business logic in pages or components.
      </Prose>

      <SectionH>Layer order (always follow this)</SectionH>
      <RowList items={[
        { label: "types/", desc: "Shared TypeScript interfaces and enums — defined once, imported everywhere" },
        { label: "lib/axios.ts", desc: "Configured Axios instance. Interceptors attach the Bearer token and handle 401 refresh" },
        { label: "hooks/", desc: "All data fetching and mutations via React Query. This is where logic lives" },
        { label: "components/", desc: "Pure UI. Receives data as props or calls hooks. No direct API calls" },
        { label: "app/", desc: "Next.js pages. Server components fetch initial data; client components render interactivity" },
      ]} />

      <SectionH>Folder structure</SectionH>
      <FileTree>{`focura-client/
├── app/
│   ├── (auth)/           # Sign-in, sign-up pages
│   ├── (workspace)/      # Protected workspace routes
│   │   ├── [slug]/       # Workspace-scoped pages
│   │   └── admin/        # Admin dashboard
│   └── api/auth/         # NextAuth route handler
├── components/
│   ├── ui/               # shadcn/ui primitives
│   └── [Feature]/        # Feature-specific components
├── hooks/
│   ├── use[Feature].ts   # One hook file per feature
│   └── use[Feature]Keys.ts # queryKeys factory
├── lib/
│   ├── axios.ts          # Axios instance + interceptors
│   └── auth/             # NextAuth config (authOptions)
├── types/                # Shared TypeScript types
├── constants/            # App-wide constants
├── context/              # React context providers
└── utils/                # Pure utility functions`}</FileTree>

      <SectionH>React Query patterns</SectionH>
      <Prose>Every hook uses a <IC>queryKeys</IC> factory so cache invalidation is always precise.</Prose>
      <CodeBlock label="hooks/useTaskKeys.ts">{`export const taskKeys = {
  all: (workspaceId: string) => ["tasks", workspaceId] as const,
  lists: (workspaceId: string) => [...taskKeys.all(workspaceId), "list"] as const,
  detail: (workspaceId: string, taskId: string) =>
    [...taskKeys.all(workspaceId), "detail", taskId] as const,
};`}</CodeBlock>

      <CodeBlock label="hooks/useTasks.ts">{`export function useTasks(workspaceId: string) {
  return useQuery({
    queryKey: taskKeys.lists(workspaceId),
    queryFn: () => api.get(\`/workspaces/\${workspaceId}/tasks\`).then(r => r.data),
    enabled: !!workspaceId,
  });
}

export function useCreateTask(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTaskInput) =>
      api.post(\`/workspaces/\${workspaceId}/tasks\`, data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskKeys.lists(workspaceId) });
    },
  });
}`}</CodeBlock>

      <SectionH>Key rules</SectionH>
      <RowList items={[
        { label: "Use qc not queryClient", desc: "Always name the QueryClient instance qc inside hooks" },
        { label: "Inline mutationFn", desc: "Write mutationFn as an inline async arrow — never extract it" },
        { label: "enabled guard", desc: "Always add enabled: !!workspaceId to prevent queries firing before workspace loads" },
        { label: "workspaceId guard", desc: "Pass workspaceId || undefined to avoid empty string '' triggering queries" },
        { label: "No logic in UI", desc: "Components call hooks and render — all fetching, error handling, and state is in hooks" },
        { label: "Server components", desc: "Use getServerSession + backendToken for SSR data hydration on initial page load" },
      ]} />

      <Tip>
        When a hook needs <IC>useRouter</IC> or other client-only APIs, extract it into its own <IC>&quot;use client&quot;</IC> file. Mixing it into a server component import trace causes build errors.
      </Tip>
    </div>
  );
}
