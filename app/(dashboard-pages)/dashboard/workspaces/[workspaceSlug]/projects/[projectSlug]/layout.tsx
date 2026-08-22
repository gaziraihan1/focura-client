import { ProjectLayoutShell } from "./ProjectLayoutShell";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string; projectSlug: string }>;
}) {
  const { workspaceSlug, projectSlug } = await params;

  return (
    <ProjectLayoutShell workspaceSlug={workspaceSlug} projectSlug={projectSlug}>
      {children}
    </ProjectLayoutShell>
  );
}
