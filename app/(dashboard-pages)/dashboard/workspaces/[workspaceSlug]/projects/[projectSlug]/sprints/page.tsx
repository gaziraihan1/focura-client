import { SprintsPageContent } from "./SprintsPageContent";

export default async function ProjectSprintsPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  return <SprintsPageContent projectSlug={projectSlug} />;
}
