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

  // Gracefully degrade when the backend is unavailable (e.g. local dev
  // without the API running) instead of crashing the whole page.
  let data;
  try {
    data = await fetchPublicProductUpdates({
      status: "PUBLIC",
      page,
      limit: 8,
    });
  } catch (error) {
    console.error("Failed to load product updates:", error);
    return null;
  }

  return <ResourcesUpdates updates={data} />;
}