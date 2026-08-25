import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { serverApiStrict } from "@/lib/api/server";
import { adminKeys } from "@/hooks/adminKeys";
import { AdminUserDetailContent } from "@/components/admin-dashboard/AdminUserDetailContent";
import type { AdminUserDetail } from "@/types/admin.types";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: adminKeys.userDetail(id),
    queryFn: () => serverApiStrict<AdminUserDetail>(`/api/v1/admin/users/${id}`),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminUserDetailContent userId={id} />
    </HydrationBoundary>
  );
}
