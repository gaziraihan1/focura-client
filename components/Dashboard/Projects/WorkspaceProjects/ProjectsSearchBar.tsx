import { Search } from "lucide-react";

interface ProjectsSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ProjectsSearchBar({
  searchQuery,
  onSearchChange,
}: ProjectsSearchBarProps) {
  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <div className="flex items-center gap-3">
        <Search className="text-muted-foreground" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects by name or description..."
          className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none"
        />
      </div>
    </div>
  );
}