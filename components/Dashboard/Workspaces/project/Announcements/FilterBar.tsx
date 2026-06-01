import { RefreshCw } from "lucide-react";

export type FilterType = "all" | "pinned" | "public" | "private";

export function FilterBar({
  active,
  onChange,
//   total,
  isFetching,
}: {
  active: FilterType;
  onChange: (f: FilterType) => void;
  total: number;
  isFetching: boolean;
}) {
  const tabs: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pinned", label: "Pinned" },
    { key: "public", label: "Public" },
    { key: "private", label: "Private" },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={[
            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
            active === t.key
              ? "bg-card text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          {t.label}
        </button>
      ))}
      {isFetching && (
        <RefreshCw size={11} className="ml-1 text-muted-foreground animate-spin" />
      )}
    </div>
  );
}