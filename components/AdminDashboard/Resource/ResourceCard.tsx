"use client";

import { useState } from "react";
import { Pencil, Trash2, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteConfirmModal } from "./DeleteConfirmationModal";

interface ResourceCardProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  badge?: string;
  badgeVariant?: "draft" | "public" | "archive";
  title: string;
  subtitle?: string;
  meta?: string;
  children?: React.ReactNode;
}

const badgeClasses: Record<string, string> = {
  DRAFT:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PUBLIC:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  ARCHIVE:
    "bg-muted text-muted-foreground",
};

export function ResourceCard({
  onEdit,
  onDelete,
  isDeleting,
  badge,
  title,
  subtitle,
  meta,
  children,
}: ResourceCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete();
    setConfirmOpen(false);
  };

  return (
    <>
      <div className="group relative flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3.5 transition-colors hover:bg-muted/40">
        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">{title}</p>
            {badge && (
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                  badgeClasses[badge] ?? badgeClasses.DRAFT,
                )}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {meta && <p className="mt-1 text-xs text-muted-foreground">{meta}</p>}
          {children}
        </div>

        {/* Actions — always visible on mobile, hover-reveal on md+ */}
        <div
          className={cn(
            "flex shrink-0 items-center gap-1",
            // Mobile: always visible
            "opacity-100",
            // Desktop: hidden until group hover
            "md:opacity-0 md:transition-opacity md:group-hover:opacity-100",
          )}
        >
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={isDeleting}
            aria-label="Delete"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {confirmOpen && (
        <DeleteConfirmModal
          title={title}
          isDeleting={isDeleting}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}
