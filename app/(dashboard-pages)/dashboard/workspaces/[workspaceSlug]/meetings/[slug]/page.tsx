import { MeetingDetailsPageContent } from "./MeetingDetailsPageContent";

export default async function MeetingDetailsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; slug: string }>;
}) {
  const { workspaceSlug, slug } = await params;
  return (
    <MeetingDetailsPageContent
      workspaceSlug={workspaceSlug}
      meetingSlug={slug}
    />
  );
}