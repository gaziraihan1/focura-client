import { ProjectsPageContent } from "./ProjectsPageContent";

export default async function WorkspaceProjectsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <ProjectsPageContent workspaceSlug={workspaceSlug} />;
}