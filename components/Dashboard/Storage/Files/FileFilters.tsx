"use client";

import React, { useState } from "react";
import { FileFilters, Uploader } from "@/hooks/useFileManagement";
import FileFiltersControl from "./FileFiltersControl";
import FileFiltersPanel from "./FileFiltersPanel";
import FileFiltersSearch from "./FileFiltersSearch";

interface FileFiltersProps {
  filters: FileFilters;
  onFiltersChange: (filters: FileFilters) => void;
  uploaders: Uploader[];
  isAdmin: boolean;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function FileFiltersComponent({
  filters,
  onFiltersChange,
  uploaders,
  isAdmin,
  viewMode,
  onViewModeChange,
}: FileFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [
    filters.fileType && filters.fileType !== "all",
    filters.uploadedBy && filters.uploadedBy !== "all",
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <FileFiltersSearch
          filters={filters}
          onFiltersChange={onFiltersChange}
        />

        <FileFiltersControl
          showFilters={showFilters}
          onShowFilters={setShowFilters}
          activeFilterCount={activeFilterCount}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>

      <FileFiltersPanel
        uploaders={uploaders}
        isAdmin={isAdmin}
        activeFilterCount={activeFilterCount}
        filters={filters}
        showFilters={showFilters}
        onFiltersChange={onFiltersChange}
      />
    </div>
  );
}
