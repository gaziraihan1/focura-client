import { MilestonesPageContent } from "./MilestonesPageContent";

export default async function ProjectMilestonesPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  return <MilestonesPageContent projectSlug={projectSlug} />;
}
