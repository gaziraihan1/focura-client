"use client";

import { useState } from "react";
import {
  useContactMessages,
  type ContactStatus,
  type ContactCategory,
  type ContactMessage,
} from "@/hooks/useContactMessage";
import {
  Mail,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { MessageRow } from "@/components/AdminDashboard/Contact/MessageRow";
import { MessageModal } from "@/components/AdminDashboard/Contact/MessageModal";
import { FilterSelect } from "@/components/AdminDashboard/Contact/FilterSelect";
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "@/constants/adminContact.constants";

export function formatCategory(cat: ContactCategory): string {
  return cat
    .split("_")
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(" ");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year:   "numeric",
    month:  "short",
    day:    "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  });
}

export default function AdminContactPage() {
  const [page, setPage]         = useState(1);
  const [status, setStatus]     = useState<ContactStatus | "">("");
  const [category, setCategory] = useState<ContactCategory | "">("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const { data, isPending, isError } = useContactMessages({
    page,
    limit: 20,
    status:   status   || undefined,
    category: category || undefined,
  });

  const messages   = data?.messages ?? [];
  const pagination = data?.pagination;
  const hasFilters = !!status || !!category;

  function resetFilters() {
    setStatus("");
    setCategory("");
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Contact Messages
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isPending
                ? "Loading…"
                : `${pagination?.total ?? 0} message${
                    pagination?.total !== 1 ? "s" : ""
                  } total`}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-muted border border-border text-muted-foreground">
            <Inbox className="w-5 h-5" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-medium">Filter</span>
          </div>

          <FilterSelect<ContactStatus>
            value={status}
            onChange={(v) => { setStatus(v); setPage(1); }}
            options={STATUS_OPTIONS}
          />

          <FilterSelect<ContactCategory>
            value={category}
            onChange={(v) => { setCategory(v); setPage(1); }}
            options={CATEGORY_OPTIONS}
          />

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Table card */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {isPending ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
              <div className="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin" />
              <p className="text-sm">Loading messages…</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <p className="text-sm font-medium text-foreground">
                Failed to load messages
              </p>
              <p className="text-xs text-muted-foreground">
                Check your connection and try again
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
              <Mail className="w-10 h-10 text-border" />
              <p className="text-sm font-medium">No messages found</p>
              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-primary hover:underline underline-offset-2"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {[
                      { label: "Sender",   cls: "" },
                      { label: "Subject",  cls: "hidden md:table-cell" },
                      { label: "Category", cls: "hidden lg:table-cell" },
                      { label: "Status",   cls: "" },
                      { label: "Date",     cls: "hidden sm:table-cell" },
                      { label: "ID",       cls: "hidden xl:table-cell" },
                    ].map(({ label, cls }) => (
                      <th
                        key={label}
                        className={`py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest ${cls}`}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <MessageRow
                      key={msg.id}
                      message={msg}
                      onClick={() => setSelected(msg)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Page{" "}
                <span className="font-medium text-foreground">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {pagination.totalPages}
                </span>
                <span className="ml-2 text-muted-foreground/60">
                  ({pagination.total} total)
                </span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <MessageModal message={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}