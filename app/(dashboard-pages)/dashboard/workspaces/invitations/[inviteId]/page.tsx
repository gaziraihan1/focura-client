import { InvitationPageContent } from "./InvitationPageContent";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ inviteId: string }>;
}) {
  const { inviteId } = await params;
  return <InvitationPageContent token={inviteId} />;
}