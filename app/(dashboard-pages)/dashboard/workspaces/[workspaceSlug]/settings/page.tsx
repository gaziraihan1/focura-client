import { SettingsPageContent } from "./SettingsPageContent";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <SettingsPageContent slug={workspaceSlug} />;
}
