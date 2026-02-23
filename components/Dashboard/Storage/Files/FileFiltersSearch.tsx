import { FileFilters } from "@/hooks/useFileManagement";
import { Search, X } from "lucide-react";
import React from "react";

interface FileFiltersSearchProps {
  filters: FileFilters;
  onFiltersChange: (filters: FileFilters) => void;
}

export default function FileFiltersSearch({
  filters,
  onFiltersChange,
}: FileFiltersSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        placeholder="Search files by name..."
        value={filters.search || ""}
        onChange={(e) =>
          onFiltersChange({ ...filters, search: e.target.value, page: 1 })
          
        }
        className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {filters.search && (
        <button
          onClick={() => onFiltersChange({ ...filters, search: "", page: 1 })}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
