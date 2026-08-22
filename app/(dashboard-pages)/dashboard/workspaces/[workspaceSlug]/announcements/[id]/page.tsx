import { AnnouncementDetail } from "@/components/Dashboard/Workspaces/Announcement/AnnouncementDetail/AnnouncementDetail";

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string; workspaceSlug: string }>;
}) {
  const { id, workspaceSlug } = await params;
  return <AnnouncementDetail id={id} workspaceSlug={workspaceSlug} />;
}