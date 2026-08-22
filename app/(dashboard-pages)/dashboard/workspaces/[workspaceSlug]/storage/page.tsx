import { StoragePageContent } from "./StoragePageContent";

export default async function WorkspaceStorage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <StoragePageContent workspaceSlug={workspaceSlug} />;
}