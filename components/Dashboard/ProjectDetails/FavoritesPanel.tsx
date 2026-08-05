"use client";

import { useState } from "react";
import { Star, Folder, MoreHorizontal, Loader2 } from "lucide-react";
import {
  useMyFavorites,
  useUpdateFavorite,
  FavoriteItem,
} from "@/hooks/useProjectFeatures";
import Link from "next/link";

export default function FavoritesPanel() {  const { data, isLoading } = useMyFavorites();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const grouped = data?.grouped ?? [];
  const ungrouped = data?.ungrouped ?? [];

  return (
    <div className="space-y-4">
      {(grouped.length === 0 && ungrouped.length === 0) ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          <Star className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No favorites yet — star projects to access them quickly.</p>
        </div>
      ) : (
        <>
          {/* Grouped favorites */}
          {grouped.map(({ group, favorites }) => (
            <div key={group}>
              <div className="flex items-center gap-2 mb-2">
                <Folder size={14} className="text-primary" />
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">{group}</span>
                <span className="text-[10px] text-muted-foreground">({favorites.length})</span>
              </div>
              <div className="space-y-1">
                {favorites.map((fav) => (
                  <FavoriteRow key={fav.id} fav={fav} />
                ))}
              </div>
            </div>
          ))}

          {/* Ungrouped favorites */}
          {ungrouped.length > 0 && (
            <div>
              {grouped.length > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <Star size={14} className="text-amber-500" />
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Quick Access</span>
                </div>
              )}
              <div className="space-y-1">
                {ungrouped.map((fav) => (
                  <FavoriteRow key={fav.id} fav={fav} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FavoriteRow({ fav }: { fav: FavoriteItem }) {
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [group, setGroup] = useState(fav.group ?? "");
  const updateFavorite = useUpdateFavorite();

  const handleUpdateGroup = async () => {
    if (updateFavorite.isPending) return;
    await updateFavorite.mutateAsync({
      projectId: fav.projectId,
      group: group || null,
    });
    setEditing(false);
  };

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 hover:shadow-sm transition-shadow group">
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/dashboard/workspaces/${fav.project.workspace?.slug ?? ""}/projects/${fav.project.slug}`}
          className="flex items-center gap-2 flex-1 min-w-0"
        >
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: fav.project.color ?? "#667eea" }}
          />
          <span className="text-sm font-medium text-foreground truncate">{fav.project.name}</span>
        </Link>

        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {fav.project.status}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded hover:bg-accent transition opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal size={12} className="text-muted-foreground" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-6 z-20 w-36 rounded-lg border border-border bg-popover shadow-lg py-1">
                  <button
                    onClick={() => { setShowMenu(false); setEditing(true); }}
                    className="w-full px-3 py-1.5 text-xs text-left hover:bg-accent transition"
                  >
                    Set Group
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <div className="mt-2 flex items-center gap-2">
          <input
            className="flex-1 px-2 py-1 rounded border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Group name (e.g., Active)"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUpdateGroup()}
            autoFocus
          />
          <button
            onClick={handleUpdateGroup}
            className="px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] font-semibold"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
