
import { FILTER_OPTIONS } from "@/constant/storage.constant";
import { FilterType } from "@/types/storage.types";

interface TableHeaderProps {
  filterType: string;
  setFilterType: (type: FilterType) => void;
}

export function TableHeader({ filterType, setFilterType }: TableHeaderProps) {
  return (
    <div className="flex items-center flex-wrap justify-between mb-6 gap-4">
      <div>
        <h2 className="text-lg font-semibold">Largest Files</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage workspace storage
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterType(filter.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterType === filter.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}