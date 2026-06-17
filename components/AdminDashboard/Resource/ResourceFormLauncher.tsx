"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PopularResourceForm } from "./PopularResourceForm";
import { ProductUpdateForm } from "./ProductUpdateForm";
import { PopularResourceList } from "./PopularResourceList";
import { ProductUpdateList } from "./ProductUpdateList";
import type { PopularResourceDTO, ProductUpdateDTO } from "@/types/resource.types";

type Tab = "popular" | "product-update";

type PanelState =
  | { kind: "closed" }
  | { kind: "create-popular" }
  | { kind: "create-update" }
  | { kind: "edit-popular"; data: PopularResourceDTO }
  | { kind: "edit-update"; data: ProductUpdateDTO };

export function ResourceFormLauncher() {
  const [activeTab, setActiveTab] = useState<Tab>("popular");
  const [panel, setPanel] = useState<PanelState>({ kind: "closed" });

  const closePanel = () => setPanel({ kind: "closed" });

  const panelTitle =
    panel.kind === "create-popular"
      ? "New popular resource"
      : panel.kind === "create-update"
        ? "New product update"
        : panel.kind === "edit-popular"
          ? "Edit popular resource"
          : panel.kind === "edit-update"
            ? "Edit product update"
            : "";

  const isCreatingForTab =
    (activeTab === "popular" && panel.kind === "create-popular") ||
    (activeTab === "product-update" && panel.kind === "create-update");

  return (
    <div className="space-y-6">
      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
        {(["popular", "product-update"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              closePanel();
            }}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab === "popular" ? "Popular resources" : "Product updates"}
          </button>
        ))}
      </div>

      {/* ── List section ── */}
      <div className="rounded-lg border border-border bg-card">
        {/* List header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">
            {activeTab === "popular" ? "Popular resources" : "Product updates"}
          </h2>
          <button
            type="button"
            onClick={() =>
              setPanel(
                isCreatingForTab
                  ? { kind: "closed" }
                  : activeTab === "popular"
                    ? { kind: "create-popular" }
                    : { kind: "create-update" },
              )
            }
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              isCreatingForTab
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-background text-foreground hover:bg-muted",
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            {activeTab === "popular" ? "New resource" : "New update"}
          </button>
        </div>

        {/* List body */}
        <div className="p-4">
          {activeTab === "popular" ? (
            <PopularResourceList
              onEdit={(resource) => {
                setPanel({ kind: "edit-popular", data: resource });
              }}
            />
          ) : (
            <ProductUpdateList
              onEdit={(update) => {
                setPanel({ kind: "edit-update", data: update });
              }}
            />
          )}
        </div>
      </div>

      {/* ── Form panel (create / edit) ── */}
      {panel.kind !== "closed" && (
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              {/* Subtle mode badge */}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  panel.kind.startsWith("edit")
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary/10 text-primary",
                )}
              >
                {panel.kind.startsWith("edit") ? "Editing" : "New"}
              </span>
              <h2 className="text-sm font-semibold text-foreground">{panelTitle}</h2>
            </div>
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close form"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 sm:p-5">
            {(panel.kind === "create-popular" || panel.kind === "edit-popular") && (
              <PopularResourceForm
                editData={panel.kind === "edit-popular" ? panel.data : undefined}
                onSuccess={closePanel}
              />
            )}
            {(panel.kind === "create-update" || panel.kind === "edit-update") && (
              <ProductUpdateForm
                editData={panel.kind === "edit-update" ? panel.data : undefined}
                onSuccess={closePanel}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}