import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { serverApiStrict } from "@/lib/api/server";
import { adminKeys } from "@/hooks/useAdmin";
import { AdminWorkspaceDetailContent } from "@/components/AdminDashboard/AdminWorkspaceDetailContent";
import type { AdminWorkspaceDetail } from "@/types/admin.types";

export default async function AdminWorkspaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: adminKeys.workspaceDetail(slug),
    queryFn: () =>
      serverApiStrict<AdminWorkspaceDetail>(`/api/v1/admin/workspaces/${slug}`),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminWorkspaceDetailContent workspaceSlug={slug} />
    </HydrationBoundary>
  );
}
