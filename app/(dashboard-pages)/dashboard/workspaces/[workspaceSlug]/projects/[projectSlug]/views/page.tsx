import { ViewsPageContent } from "./ViewsPageContent";

export default async function ProjectViewsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectSlug: string }>;
}) {
  const { workspaceSlug, projectSlug } = await params;
  return (
    <ViewsPageContent
      workspaceSlug={workspaceSlug}
      projectSlug={projectSlug}
    />
  );
}
