import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { serverApiStrict } from "@/lib/api/server";
import { adminKeys } from "@/hooks/useAdmin";
import { AdminActivityContent } from "@/components/AdminDashboard/AdminActivityContent";
import type { AdminPaginatedResponse, AdminActivity } from "@/types/admin.types";

// Must match the initial useAdminPagination() + useAdminActivity() params
// in AdminActivityContent so the seeded cache key matches the client key.
const INITIAL_PARAMS = { page: 1, pageSize: 30 };

export default async function AdminActivityPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: adminKeys.activity(INITIAL_PARAMS),
    queryFn: () =>
      serverApiStrict<AdminPaginatedResponse<AdminActivity>>(
        "/api/v1/admin/activity?page=1&pageSize=30",
        { unwrap: false },
      ),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminActivityContent />
    </HydrationBoundary>
  );
}
