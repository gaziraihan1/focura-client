"use client";

import { useState }                from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Label }                   from "@/hooks/useLabels";
import { Edit2, MoreVertical, Tag, Trash2 } from "lucide-react";
import Link                        from "next/link";
import { PermissionModal }         from "@/components/Shared/PermissionModal";

interface LabelCardProps {
  label:            Label;
  onEdit:           () => void;
  onDelete:         () => void;
  isDropdownActive: boolean;
  onDropdownToggle: (e: React.MouseEvent) => void;
  canManageLabels:  boolean;
}

export default function LabelCard({
  label,
  onEdit,
  onDelete,
  isDropdownActive,
  onDropdownToggle,
  canManageLabels,
}: LabelCardProps) {
  const taskCount = label._count?.tasks ?? 0;

  const [permissionModal, setPermissionModal] = useState<"update" | "delete" | null>(null);

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    if (canManageLabels) {
      onEdit();
    } else {
      setPermissionModal("update");
    }
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (canManageLabels) {
      onDelete();
    } else {
      setPermissionModal("delete");
    }
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-all relative group"
      >
        <div className="flex items-start justify-between mb-3">
          <Link
            href={`/dashboard/workspaces/${label?.workspace?.slug}/label/${label.id}`}
            className="flex items-center gap-2 flex-1 min-w-0"
          >
            <div
              className="w-3 h-3 rounded-full shrink-0 ring-2 ring-background"
              style={{ backgroundColor: label.color }}
            />
            <h3 className="font-medium text-foreground truncate hover:underline">
              {label.name}
            </h3>
          </Link>

          <div className="relative">
            <button
              onClick={onDropdownToggle}
              className="p-1.5 md:opacity-0 group-hover:opacity-100 hover:bg-accent rounded transition-all"
              aria-label="Label options"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>

            <AnimatePresence>
              {isDropdownActive && (
                <>
                  <div className="fixed inset-0 z-10" onClick={(e) => e.stopPropagation()} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-1 w-40 bg-popover border border-border rounded-lg shadow-lg py-1 z-20"
                  >
                    <button
                      onClick={handleEdit}
                      className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Link
          href={`/dashboard/workspaces/${label?.workspace?.slug}/label/${label.id}`}
          className="block"
        >
          {label.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {label.description}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>
                {taskCount} task{taskCount !== 1 ? "s" : ""}
              </span>
            </div>
            <span>
              {new Date(label.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day:   "numeric",
              })}
            </span>
          </div>
        </Link>
      </motion.div>

      <PermissionModal
        operation={permissionModal ?? "update"}
        resource="label"
        isOpen={permissionModal !== null}
        onClose={() => setPermissionModal(null)}
      />
    </>
  );
}