"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, AlertCircle, Globe, Compass } from "lucide-react";
import { usePublicWorkspaces } from "@/hooks/useWorkspaceQueries";
import { PublicWorkspaceCard } from "@/components/Dashboard/Workspaces/Workspaces/PublicWorkspaceCard";

const PAGE_SIZE = 12;

export default function BrowsePublicWorkspacesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce the search input (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePublicWorkspaces({
    search: debouncedSearch,
    pageSize: PAGE_SIZE,
  });

  // Flatten all loaded pages into a single list
  const items = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );
  const total = data?.pages[0]?.total ?? 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Compass size={22} />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold">
              Browse Public Workspaces
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Discover workspaces other teams have made public and explore their
              projects.
            </p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search public workspaces by name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {isLoading && items.length === 0 && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {isError && items.length === 0 && (
        <div className="text-center py-16 rounded-xl bg-card border">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load public workspaces</p>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="text-center py-16 rounded-xl bg-card border">
          <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold">
            {debouncedSearch ? "No public workspaces found" : "No public workspaces yet"}
          </h3>
          <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
            {debouncedSearch
              ? `No public workspaces match "${debouncedSearch}". Try a different name.`
              : "Workspaces appear here once their owner marks them Public in settings."}
          </p>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((workspace) => (
              <PublicWorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground flex items-center gap-2 text-sm disabled:opacity-60"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  `Load more (` + items.length + ` of ` + total + `)`
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
