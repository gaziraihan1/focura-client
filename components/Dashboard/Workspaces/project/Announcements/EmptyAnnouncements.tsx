import { Megaphone, Plus } from "lucide-react";

export function EmptyAnnouncements({
  filtered,
  canManage,
  onNew,
}: {
  filtered: boolean;
  canManage: boolean;
  onNew: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      {/* Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center">
          <Megaphone size={32} className="text-muted-foreground/40" />
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-border" />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-border/60" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">
          {filtered ? "No matching announcements" : "No announcements yet"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          {filtered
            ? "Try adjusting your search or filter to find what you're looking for."
            : canManage
            ? "Create the first announcement to keep your team informed."
            : "There are no announcements in this project yet."}
        </p>
      </div>

      {!filtered && canManage && (
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          Create Announcement
        </button>
      )}
    </div>
  );
}