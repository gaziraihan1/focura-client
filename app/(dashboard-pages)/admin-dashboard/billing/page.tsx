import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { serverApiStrict } from "@/lib/api/server";
import { adminKeys } from "@/hooks/adminKeys";
import { AdminBillingContent } from "@/components/admin-dashboard/AdminBillingContent";
import type { AdminPaginatedResponse, AdminBilling } from "@/types/admin.types";

// Must match the initial useAdminPagination() + useAdminBilling() params
// in AdminBillingContent so the seeded cache key matches the client key.
const INITIAL_PARAMS = { page: 1, search: "", pageSize: 20 };

export default async function AdminBillingPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: adminKeys.billing(INITIAL_PARAMS),
    queryFn: () =>
      serverApiStrict<AdminPaginatedResponse<AdminBilling>>(
        "/api/v1/admin/billing?page=1&pageSize=20",
        { unwrap: false },
      ),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminBillingContent />
    </HydrationBoundary>
  );
}
