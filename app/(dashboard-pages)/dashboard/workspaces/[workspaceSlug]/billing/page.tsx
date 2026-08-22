import { BillingPageContent } from "./BillingPageContent";

export default async function WorkspaceBillingPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <BillingPageContent workspaceSlug={workspaceSlug} />;
}
