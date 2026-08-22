import { BillingSuccessPageContent } from "./BillingSuccessPageContent";

export default async function BillingSuccessPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <BillingSuccessPageContent workspaceSlug={workspaceSlug} />;
}
