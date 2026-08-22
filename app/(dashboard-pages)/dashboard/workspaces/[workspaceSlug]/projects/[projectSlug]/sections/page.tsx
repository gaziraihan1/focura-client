import { SectionsPageContent } from "./SectionsPageContent";

export default async function ProjectSectionsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectSlug: string }>;
}) {
  const { workspaceSlug, projectSlug } = await params;
  return (
    <SectionsPageContent
      workspaceSlug={workspaceSlug}
      projectSlug={projectSlug}
    />
  );
}
