import { WorkspaceDetailPageContent } from "./WorkspaceDetailPageContent";

export default async function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <WorkspaceDetailPageContent slug={workspaceSlug} />;
}
