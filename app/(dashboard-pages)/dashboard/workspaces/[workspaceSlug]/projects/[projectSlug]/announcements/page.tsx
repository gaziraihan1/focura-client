import { AnnouncementsPageContent } from "./AnnouncementsPageContent";

export default async function AnnouncementsPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  return <AnnouncementsPageContent projectSlug={projectSlug} />;
}
