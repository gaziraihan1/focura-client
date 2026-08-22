import { ProjectSettingsPageContent } from "./ProjectSettingsPageContent";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectSlug: string }>;
}) {
  const { workspaceSlug, projectSlug } = await params;
  return (
    <ProjectSettingsPageContent
      workspaceSlug={workspaceSlug}
      projectSlug={projectSlug}
    />
  );
}
