"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAdminProductUpdates, useDeleteProductUpdate } from "@/hooks/useResource";
import { ResourceCard } from "./ResourceCard";
import { ResourcePagination } from "./ResourcePagination";
import type { ProductUpdateDTO } from "@/types/resource.types";

interface ProductUpdateListProps {
  onEdit: (update: ProductUpdateDTO) => void;
}

export function ProductUpdateList({ onEdit }: ProductUpdateListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isPlaceholderData } = useAdminProductUpdates(page);
  const { mutate: deleteUpdate, variables: deletingId, isPending: isDeleting } = useDeleteProductUpdate();

  const updates = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const total = data?.data?.total ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!updates.length) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No product updates yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">{total} update{total !== 1 ? "s" : ""}</p>
      <div className="space-y-1.5">
        {updates.map((update) => (
          <ResourceCard
            key={update.id}
            title={update.title}
            subtitle={update.description}
            badge={update.status}
            meta={`v${update.version} · ${new Date(update.date).toLocaleDateString()}`}
            onEdit={() => onEdit(update)}
            onDelete={() => deleteUpdate(update.slug)}
            isDeleting={isDeleting && deletingId === update.slug}
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