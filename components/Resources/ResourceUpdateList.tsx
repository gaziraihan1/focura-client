import { fetchPublicProductUpdates } from "@/hooks/usePublicResource";
import ResourcesUpdates from "./ResourcesUpdates";

interface ResourcePopularListProps {
  searchParams?: {
    page?: string;
  };
}

export default async function ResourceUpdateList({
  searchParams,
}: ResourcePopularListProps) {
const page = Math.max(1, Number(searchParams?.page || 1));
  const data = await fetchPublicProductUpdates({
    status: "PUBLIC",
    page,
    limit: 8,
  });

  return <ResourcesUpdates updates={data} />;
}