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
  try {
    const data = await fetchPublicProductUpdates({
      status: "PUBLIC",
      page,
      limit: 8,
    });

    return <ResourcesUpdates updates={data} />;
  } catch (error) {
    console.error("Failed to load product updates:", error);
    return null;
  }
}