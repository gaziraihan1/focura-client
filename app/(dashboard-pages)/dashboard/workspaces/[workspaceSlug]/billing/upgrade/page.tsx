import { UpgradePageContent } from "./UpgradePageContent";

export default async function WorkspaceUpgradePage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <UpgradePageContent workspaceSlug={workspaceSlug} />;
}
