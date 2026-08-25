import { AnnouncementDetail } from "@/components/dashboard/workspace/announcements/AnnouncementDetail/AnnouncementDetail";

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string; workspaceSlug: string }>;
}) {
  const { id, workspaceSlug } = await params;
  return <AnnouncementDetail id={id} workspaceSlug={workspaceSlug} />;
}