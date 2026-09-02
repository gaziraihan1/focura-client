import { Filter, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface FileFiltersControlProps {
    showFilters: boolean;
    activeFilterCount: number;
    onShowFilters: (v: boolean) => void;
    viewMode: "grid" | "list";
    onViewModeChange: (v: ("grid" | "list")) => void

}

export default function FileFiltersControl({showFilters, activeFilterCount, onShowFilters, onViewModeChange, viewMode}: FileFiltersControlProps) {
  return (
    <div className="flex gap-2">
          {/* Filter Toggle */}
          <Button
            variant="ghost"
            onClick={() => onShowFilters(!showFilters)}
            className={`h-auto w-auto gap-2 px-4 py-2.5 rounded-lg border border-border ${
              showFilters || activeFilterCount > 0 ? 'bg-muted' : ''
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* View Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              onClick={() => onViewModeChange('grid')}
              className={`h-auto w-auto px-4 py-2.5 rounded-none ${
                viewMode === 'grid' ? 'bg-muted' : ''
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => onViewModeChange('list')}
              className={`h-auto w-auto px-4 py-2.5 rounded-none border-l border-border ${
                viewMode === 'list' ? 'bg-muted' : ''
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
  )
}
