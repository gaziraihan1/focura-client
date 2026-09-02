"use client";

import { useEffect, useRef, useEffectEvent } from "react";
import { Loader2 } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { Button } from "@/components/ui/Button";

interface DeleteNotificationsDialogProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteNotificationsDialog({
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: DeleteNotificationsDialogProps) {
  const trapRef = useFocusTrap(isOpen);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  const onEscape = useEffectEvent((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); });
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-notifications-title"
    >
      <div ref={trapRef} className="bg-popover border border-border rounded-xl p-6 max-w-md w-full shadow-lg">
        <h3 id="delete-notifications-title" className="text-lg font-semibold mb-2">
          Delete Read Notifications?
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          This will permanently delete all read notifications. This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-4 py-2 text-sm font-medium rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            variant="destructive"
            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-destructive/90 text-destructive-foreground flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
