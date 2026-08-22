import { FilesPageContent } from "./FilesPageContent";

export default async function WorkspaceFilesPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <FilesPageContent workspaceSlug={workspaceSlug} />;
}