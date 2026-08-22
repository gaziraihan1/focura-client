import { FavoritesPageContent } from "./FavoritesPageContent";

export default async function ProjectFavoritesPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectSlug: string }>;
}) {
  const { workspaceSlug, projectSlug } = await params;
  return (
    <FavoritesPageContent
      workspaceSlug={workspaceSlug}
      projectSlug={projectSlug}
    />
  );
}
