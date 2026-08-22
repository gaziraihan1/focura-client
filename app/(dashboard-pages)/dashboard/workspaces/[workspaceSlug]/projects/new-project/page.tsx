import { NewProjectPageContent } from "./NewProjectPageContent";

export default async function WorkspaceNewProjectPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <NewProjectPageContent workspaceSlug={workspaceSlug} />;
}