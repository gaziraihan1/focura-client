import { Filter, Grid, List } from 'lucide-react'
import React from 'react'

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
          <button
            onClick={() => onShowFilters(!showFilters)}
            className={`px-4 py-2.5 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2 ${
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
          </button>

          {/* View Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-4 py-2.5 hover:bg-muted transition-colors ${
                viewMode === 'grid' ? 'bg-muted' : ''
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-4 py-2.5 hover:bg-muted transition-colors border-l ${
                viewMode === 'list' ? 'bg-muted' : ''
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
  )
}
