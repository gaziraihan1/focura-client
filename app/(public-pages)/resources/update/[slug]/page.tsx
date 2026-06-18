import { notFound } from "next/navigation";
import { fetchPublicProductUpdate } from "@/hooks/usePublicResource";
import { UpdateDetailsView } from "@/components/Resources/Update/UpdateDetailsView";

type ResourceDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function UpdateResourceDetailsPage({ params }: ResourceDetailsPageProps) {
  const { slug } = await params;
  const data = await fetchPublicProductUpdate(slug);

  if (!data) {
    notFound();
  }

  return <UpdateDetailsView data={data} />;
}