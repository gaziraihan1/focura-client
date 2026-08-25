import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { serverApiStrict } from "@/lib/api/server";
import { adminKeys } from "@/hooks/useAdmin";
import { AdminOverviewContent } from "@/components/AdminDashboard/AdminOverviewContent";
import type { AdminStats } from "@/types/admin.types";

// SSR prefetch: stats are fetched on the server and seeded into the React
// Query cache so AdminOverviewContent renders with data immediately instead
// of showing a client-side loading state. If the prefetch fails (backend
// down, no token) the cache stays empty and the hook fetches after hydration.
export default async function AdminOverviewPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: adminKeys.stats,
    queryFn: () => serverApiStrict<AdminStats>("/api/v1/admin/stats"),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminOverviewContent />
    </HydrationBoundary>
  );
}
