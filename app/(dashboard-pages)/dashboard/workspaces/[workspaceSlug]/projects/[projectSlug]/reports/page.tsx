import { ReportsPageContent } from "./ReportsPageContent";

export default async function ProjectTimeReportPageWrapper({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  return <ReportsPageContent projectSlug={projectSlug} />;
}
