"use client";

import { useEffect, useRef } from "react";
import { X, ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";

// ─── Types ────────────────────────────────────────────────────────────────────

type Operation = "create" | "update" | "delete" | "manage";

interface PermissionModalProps {
  operation:  Operation;
  isOpen:     boolean;
  onClose:    () => void;
  /** Optional override for the resource name, e.g. "label", "project" */
  resource?:  string;
  className?: string;
}

// ─── Config per operation ─────────────────────────────────────────────────────

const operationConfig: Record<
  Operation,
  { label: string; verb: string; accentClass: string }
> = {
  create: {
    label:       "Create",
    verb:        "create",
    accentClass: "text-emerald-600 dark:text-emerald-400",
  },
  update: {
    label:       "Update",
    verb:        "update",
    accentClass: "text-blue-600 dark:text-blue-400",
  },
  delete: {
    label:       "Delete",
    verb:        "delete",
    accentClass: "text-destructive",
  },
  manage: {
    label:       "Manage",
    verb:        "manage",
    accentClass: "text-violet-600 dark:text-violet-400",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PermissionModal({
  operation,
  isOpen,
  onClose,
  resource = "this resource",
  className,
}: PermissionModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const trapRef    = useFocusTrap(isOpen);
  const config     = operationConfig[operation];

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="permission-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={trapRef}
        className={cn(
          "relative z-10 w-full max-w-md rounded-xl border border-border bg-card shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          className,
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center gap-5 px-6 py-8 text-center">
          {/* Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2
              id="permission-modal-title"
              className="text-base font-semibold text-foreground"
            >
              Permission Required
            </h2>
            <p className="text-sm text-muted-foreground">
              You don&apos;t have access to{" "}
              <span className={cn("font-medium", config.accentClass)}>
                {config.verb}
              </span>{" "}
              {resource}.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-border" />

          {/* Allowed roles */}
          <div className="w-full space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Who can {config.verb} this?
            </p>

            <div className="flex flex-col gap-2">
              <RolePill label="Workspace Owner" description="Full access to all operations" />
              <RolePill label="Workspace Admin" description={`Can ${config.verb} ${resource}`} />
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="mt-1 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Internal sub-component ───────────────────────────────────────────────────

function RolePill({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-left">
      <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}