import { FileFilters, Uploader } from '@/hooks/useFileManagement';
import { ArrowUpDown, X } from 'lucide-react'
import React from 'react'

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
            <label className="block text-sm font-medium mb-2">File Type</label>
            <select
              value={filters.fileType || 'all'}
              onChange={(e) => onFiltersChange({ ...filters, fileType: e.target.value, page: 1 })}
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
              <label className="block text-sm font-medium mb-2">Uploaded By</label>
              <select
                value={filters.uploadedBy || 'all'}
                onChange={(e) => onFiltersChange({ ...filters, uploadedBy: e.target.value, page: 1 })}
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
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              value={filters.sortBy || 'date'}
              onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as "name" | "size" | "date" | undefined })}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option value="date">Upload Date</option>
              <option value="name">File Name</option>
              <option value="size">File Size</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium mb-2">Order</label>
            <button
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
                })
              }
              className="w-full px-3 py-2 border rounded-lg hover:bg-muted flex items-center justify-center gap-2 bg-background"
            >
              <ArrowUpDown className="w-4 h-4" />
              {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="md:col-span-2 lg:col-span-4 flex justify-end">
              <button
                onClick={() =>
                  onFiltersChange({
                    search: '',
                    fileType: 'all',
                    uploadedBy: 'all',
                    sortBy: 'date',
                    sortOrder: 'desc',
                    page: 1,
                  })
                }
                className="px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
