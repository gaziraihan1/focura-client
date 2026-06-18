import { notFound } from "next/navigation";
import { fetchPublicPopularResource } from "@/hooks/usePublicResource";
import { PopularResourceDetailsView } from "@/components/Resources/Popular/PopularResourceDetailsView";

type ResourceDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PopularResourceDetailsPage({ params }: ResourceDetailsPageProps) {
  const { slug } = await params;
  const data = await fetchPublicPopularResource(slug);

  if (!data) {
    notFound();
  }

  return <PopularResourceDetailsView data={data} />;
}