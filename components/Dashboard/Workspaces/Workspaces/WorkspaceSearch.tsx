import { Search } from "lucide-react";

interface WorkspaceSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function WorkspaceSearch({
  value,
  onChange,
}: WorkspaceSearchProps) {
  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={18}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search workspaces..."
        className="w-full pl-10 pr-4 py-3 rounded-lg bg-card border focus:ring-2 ring-primary outline-none"
      />
    </div>
  );
}
