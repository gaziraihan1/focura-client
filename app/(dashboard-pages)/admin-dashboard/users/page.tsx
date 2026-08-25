import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { serverApiStrict } from "@/lib/api/server";
import { adminKeys } from "@/hooks/useAdmin";
import { AdminUsersContent } from "@/components/AdminDashboard/AdminUsersContent";
import type { AdminPaginatedResponse, AdminUser } from "@/types/admin.types";

// Must match the initial useAdminPagination() + useAdminUsers() params in
// AdminUsersContent so the seeded cache key is identical to the client key.
const INITIAL_PARAMS = { page: 1, search: "", pageSize: 20 };

export default async function AdminUsersPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: adminKeys.users(INITIAL_PARAMS),
    queryFn: () =>
      serverApiStrict<AdminPaginatedResponse<AdminUser>>(
        "/api/v1/admin/users?page=1&pageSize=20",
        { unwrap: false },
      ),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminUsersContent />
    </HydrationBoundary>
  );
}
