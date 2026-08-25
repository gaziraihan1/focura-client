import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { serverApiStrict } from "@/lib/api/server";
import { adminKeys } from "@/hooks/adminKeys";
import { AdminWorkspacesContent } from "@/components/admin-dashboard/AdminWorkspacesContent";
import type { AdminPaginatedResponse, AdminWorkspace } from "@/types/admin.types";

// Must match the initial useAdminPagination() + useAdminWorkspaces() params
// in AdminWorkspacesContent so the seeded cache key matches the client key.
const INITIAL_PARAMS = { page: 1, search: "", pageSize: 20 };

export default async function AdminWorkspacesPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: adminKeys.workspaces(INITIAL_PARAMS),
    queryFn: () =>
      serverApiStrict<AdminPaginatedResponse<AdminWorkspace>>(
        "/api/v1/admin/workspaces?page=1&pageSize=20",
        { unwrap: false },
      ),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminWorkspacesContent />
    </HydrationBoundary>
  );
}
