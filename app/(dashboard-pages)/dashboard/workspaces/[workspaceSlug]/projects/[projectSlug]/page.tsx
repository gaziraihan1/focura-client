import { ProjectOverviewPageContent } from "./ProjectOverviewPageContent";

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectSlug: string }>;
}) {
  const { workspaceSlug, projectSlug } = await params;
  return (
    <ProjectOverviewPageContent
      workspaceSlug={workspaceSlug}
      projectSlug={projectSlug}
    />
  );
}
