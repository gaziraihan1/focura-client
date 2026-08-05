"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Zap, X, Check, Loader2, AlertCircle } from "lucide-react";
import { useEnergyLevel } from "@/hooks/useEnergyLevel";
import { cn } from "@/lib/utils";

// ─── Component ─────────────────────────────────────────────────────────────

type SaveStatus = "idle" | "saving" | "success" | "error";

export function EnergyQuickLog() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(5);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const popupRef = useRef<HTMLDivElement>(null);

  // Capture the current day once so saves always target the same date
  const today = useMemo(() => new Date(), []);
  const { data: energy, logEnergy } = useEnergyLevel(today);

  // Toggle the popup; only pre-fill from today's logged energy when opening
  // (never on re-click while open, which would wipe in-progress edits)
  const handleToggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    if (energy?.energyLevel) setValue(energy.energyLevel);
    setNote(energy?.note ?? "");
    setOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Clear success/error after a few seconds
  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSave = async () => {
    if (status === "saving") return; // Guard against concurrent auto-save + button clicks
    setStatus("saving");
    const ok = await logEnergy({
      date: today,
      energyLevel: value,
      note: note.trim() || undefined,
    });
    setStatus(ok ? "success" : "error");
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Log energy level"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-colors transition-transform hover:bg-primary/90 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95"
      >
        <Zap className="h-4.5 w-4.5" />
        <span>Log energy</span>
      </button>

      {/* Popup */}
      {open && (
        <div
          ref={popupRef}
          className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl border border-border bg-card p-5 shadow-xl"
          role="dialog"
          aria-label="Log today's energy level"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  How&apos;s your energy today?
                </h4>
                <p className="text-xs text-muted-foreground">
                  {today.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Slider */}
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>😴 Low</span>
            <span className="text-lg font-bold text-foreground">{value}/10</span>
            <span>🔥 High</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            onPointerUp={handleSave}
            className="w-full accent-primary"
            aria-label="Energy level 1 to 10"
          />

          {/* Note */}
          <input
            type="text"
            placeholder="Optional note (e.g. slept well)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          {/* Save */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={status === "saving"}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {status === "saving" ? "Saving…" : "Save"}
            </button>

            {status === "success" && (
              <span
                className={cn(
                  "flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"
                )}
              >
                <Check className="h-3.5 w-3.5" /> Saved
              </span>
            )}
            {status === "error" && (
              <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="h-3.5 w-3.5" /> Failed
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
