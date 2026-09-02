import { FileFilters, Uploader } from '@/hooks/useFileManagement';
import { ArrowUpDown, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface FileFiltersPanelProps {
    showFilters: boolean;
    onFiltersChange: (filters: FileFilters) => void;
    filters: FileFilters;
    isAdmin: boolean;
    uploaders: Uploader[];
    activeFilterCount: number
}

export default function FileFiltersPanel({ showFilters, onFiltersChange, filters, isAdmin, uploaders, activeFilterCount}: FileFiltersPanelProps) {
  return (
    <>
    {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-card">
          {/* File Type */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="fld-39">File Type</label>
            <select id="fld-39"
              value={filters.fileType || 'all'}
              onChange={(e) => onFiltersChange({ ...filters, fileType: e.target.value === 'all' ? undefined : e.target.value, page: 1 })}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option value="all">All Types</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
              <option value="documents">Documents</option>
              <option value="archives">Archives</option>
            </select>
          </div>

          {/* Uploader (Admin Only) */}
          {isAdmin && uploaders.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="fld-40">Uploaded By</label>
              <select id="fld-40"
                value={filters.uploadedBy || 'all'}
                onChange={(e) => onFiltersChange({ ...filters, uploadedBy: e.target.value === 'all' ? undefined : e.target.value, page: 1 })}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="all">All Users</option>
                {uploaders.map((uploader) => (
                  <option key={uploader.id} value={uploader.id}>
                    {uploader.name || uploader.email} ({uploader.fileCount})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="fld-41">Sort By</label>
            <select id="fld-41"
              value={filters.sortBy || 'date'}
              onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as "name" | "size" | "date" })}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option value="date">Upload Date</option>
              <option value="name">File Name</option>
              <option value="size">File Size</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <span className="block text-sm font-medium mb-2">Order</span>
            <Button
              variant="outline"
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
                })
              }
              className="w-full h-auto justify-center gap-2 bg-background"
            >
              <ArrowUpDown className="w-4 h-4" />
              {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="md:col-span-2 lg:col-span-4 flex justify-end">
              <Button
                variant="ghost"
                onClick={() =>
                  onFiltersChange({
                    search: undefined,
                    fileType: undefined,
                    uploadedBy: undefined,
                    sortBy: undefined,
                    sortOrder: undefined,
                    page: 1,
                  })
                }
                className="h-auto w-auto gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
