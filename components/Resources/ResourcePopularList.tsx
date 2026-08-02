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

  // Gracefully degrade when the backend is unavailable (e.g. local dev
  // without the API running) instead of crashing the whole page.
  try {
    const data = await fetchPublicPopularResources({
      status: "PUBLIC",
      page,
      limit: 8,
    });

    return <ResourcesPopular data={data} />;
  } catch (error) {
    console.error("Failed to load popular resources:", error);
    return null;
  }
}