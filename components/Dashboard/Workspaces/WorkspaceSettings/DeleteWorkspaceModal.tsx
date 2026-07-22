"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Trash2, Loader2 } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

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

  // Reset confirm text when modal opens/closes
  useEffect(() => {
    if (!isOpen) setConfirmText("");
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

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
          This will permanently delete <strong>{workspaceName}</strong> and all
          its projects, tasks, and data. This action cannot be undone.
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
          <button
            onClick={onDelete}
            disabled={isDeleting || !isConfirmed}
            className="flex-1 px-4 py-3 rounded-lg bg-red-500 text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            aria-label={`Delete ${workspaceName} permanently`}
          >
            {isDeleting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Trash2 size={18} />
            )}
            Delete Permanently
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-lg border border-border hover:bg-accent transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
