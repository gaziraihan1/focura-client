"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ResourceCard } from "./ResourceCard";
import { ResourcePagination } from "./ResourcePagination";
import type { PopularResourceDTO } from "@/types/resource.types";
import { useAdminPopularResources, useDeletePopularResource } from "@/hooks/useResource";

interface PopularResourceListProps {
  onEdit: (resource: PopularResourceDTO) => void;
}

export function PopularResourceList({ onEdit }: PopularResourceListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isPlaceholderData } = useAdminPopularResources(page);
  const { mutate: deleteResource, variables: deletingId, isPending: isDeleting } = useDeletePopularResource();

  const resources = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const total = data?.data?.total ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!resources.length) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No popular resources yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">{total} resource{total !== 1 ? "s" : ""}</p>
      <div className="space-y-1.5">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            title={resource.title}
            subtitle={resource.description}
            badge={resource.status}
            meta={`${resource.category} · /${resource.slug}`}
            onEdit={() => onEdit(resource)}
            onDelete={() => deleteResource(resource.slug)}
            isDeleting={isDeleting && deletingId === resource.id}
          />
        ))}
      </div>
      <ResourcePagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isPlaceholder={isPlaceholderData}
      />
    </div>
  );
}