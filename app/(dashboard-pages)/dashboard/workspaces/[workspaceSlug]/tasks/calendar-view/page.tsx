import { CalendarViewPageContent } from "./CalendarViewPageContent";

export default async function WorkspaceCalendarViewPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <CalendarViewPageContent />;
}