import { fetchPublicPopularResources } from "@/hooks/usePublicResource";
import ResourcesPopular from "./ResourcesPopular";

interface ResourcePopularListProps {
  searchParams?: {
    page?: string;
  };
}

export default async function ResourcePopularList({
  searchParams,
}: ResourcePopularListProps) {
const page = Math.max(1, Number(searchParams?.page || 1));
  const data = await fetchPublicPopularResources({
    status: "PUBLIC",
    page,
    limit: 8,
  });

  return <ResourcesPopular data={data} />;
}