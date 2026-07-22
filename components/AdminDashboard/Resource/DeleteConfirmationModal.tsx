"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface DeleteConfirmModalProps {
  title: string;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ title, isDeleting, onCancel, onConfirm }: DeleteConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const trapRef = useFocusTrap(true);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isDeleting, onCancel]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      onClick={(e) => {
        if (e.target === overlayRef.current && !isDeleting) onCancel();
      }}
    >
      <div ref={trapRef} className="w-full max-w-sm rounded-lg border border-border bg-card p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle
             className="h-4.5 w-4.5 text-destructive" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="delete-confirm-title" className="text-sm font-semibold text-foreground">
              Delete this item?
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">&ldquo;{title}&rdquo;</span> will be
              permanently deleted. This action cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Close"
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
