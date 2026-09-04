"use client";

import { useEffect, useState, useEffectEvent } from "react";
import { AlertCircle, Trash2, Loader2 } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

import { Button } from "@/components/ui/Button";

interface DeleteWorkspaceModalProps {
  isOpen: boolean;
  workspaceName: string;
  isDeleting: boolean;
  onDelete: () => void;
  onClose: () => void;
}

export function DeleteWorkspaceModal({
  isOpen,
  workspaceName,
  isDeleting,
  onDelete,
  onClose,
}: DeleteWorkspaceModalProps) {
  const trapRef = useFocusTrap(isOpen);
  const [confirmText, setConfirmText] = useState("");

  // Close on Escape
  const onEscape = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  });
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmed = confirmText === workspaceName;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-workspace-title"
      aria-describedby="delete-workspace-desc"
    >
      <div
        ref={trapRef}
        className="bg-card rounded-xl border border-border w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-red-500/10">
            <AlertCircle className="text-red-500" size={24} aria-hidden="true" />
          </div>
          <h3
            id="delete-workspace-title"
            className="text-xl font-semibold text-foreground"
          >
            Delete Workspace?
          </h3>
        </div>

        <p id="delete-workspace-desc" className="text-muted-foreground mb-4">
          This will remove <strong>{workspaceName}</strong> and its content from
          your dashboard. Your data is kept so it can be restored by Gablura
          support if this was a mistake.
        </p>

        {/* Type-to-confirm */}
        <div className="mb-6">
          <label
            htmlFor="delete-confirm-input"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Type <span className="font-mono font-bold">{workspaceName}</span> to
            confirm
          </label>
          <input
            id="delete-confirm-input"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={workspaceName}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting || !isConfirmed}
            className="flex-1 px-4 py-3 bg-red-500 text-white hover:opacity-90"
            aria-label={`Delete ${workspaceName}`}
          >
            {isDeleting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Trash2 size={18} />
            )}
            Delete Workspace
          </Button>
          <Button variant="outline" onClick={onClose} className="px-4 py-3 hover:bg-accent">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
