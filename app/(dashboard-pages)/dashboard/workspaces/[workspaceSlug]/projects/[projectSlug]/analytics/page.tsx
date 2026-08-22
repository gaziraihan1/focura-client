import { AnalyticsPageContent } from "./AnalyticsPageContent";

export default async function ProjectAnalyticsPageWrapper({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  return <AnalyticsPageContent projectSlug={projectSlug} />;
}
