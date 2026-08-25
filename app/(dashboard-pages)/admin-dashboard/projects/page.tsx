import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { serverApiStrict } from "@/lib/api/server";
import { adminKeys } from "@/hooks/useAdmin";
import { AdminProjectsContent } from "@/components/AdminDashboard/AdminProjectsContent";
import type { AdminPaginatedResponse, AdminProject } from "@/types/admin.types";

// Must match the initial useAdminPagination() + useAdminProjects() params
// in AdminProjectsContent so the seeded cache key matches the client key.
const INITIAL_PARAMS = { page: 1, search: "", pageSize: 20 };

export default async function AdminProjectsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: adminKeys.projects(INITIAL_PARAMS),
    queryFn: () =>
      serverApiStrict<AdminPaginatedResponse<AdminProject>>(
        "/api/v1/admin/projects?page=1&pageSize=20",
        { unwrap: false },
      ),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminProjectsContent />
    </HydrationBoundary>
  );
}
