'use client';

import { motion } from 'framer-motion';
import { CheckSquare, Square } from 'lucide-react';
import { TableHeader } from './LargestFilesTable/TableHeader';
import { LargestFilesTableProps } from '@/types/storage.types';
import { useLargestFilesTable } from '@/hooks/useLargestFileTable';
import { AdminBadge } from './LargestFilesTable/AdminBadge';
import { BulkActionsBar } from './LargestFilesTable/BulkActionsBar';
import { FileTableRow } from './LargestFilesTable/FileTableRow';
import { EmptyState } from './LargestFilesTable/EmptyState';

export function LargestFilesTable({
  files,
  workspaceId,
  isAdmin,
}: LargestFilesTableProps) {
  const {
    currentUserId,
    selectedFiles,
    filteredAndSortedFiles,
    selectedFilesSize,
    deletableCount,
    deletingFileId,
    filterType,
    isDeleting,
    toggleFileSelection,
    selectAll,
    clearSelection,
    setFilterType,
    handleBulkDelete,
    handleDeleteFile,
  } = useLargestFilesTable(files, workspaceId, isAdmin);

  const allSelected = selectedFiles.size === filteredAndSortedFiles.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border rounded-lg p-6"
    >
      <TableHeader filterType={filterType} setFilterType={setFilterType} />

      {/* Admin Badge */}
      {isAdmin && <AdminBadge />}

      <BulkActionsBar
        selectedCount={selectedFiles.size}
        selectedFilesSize={selectedFilesSize}
        deletableCount={deletableCount}
        isAdmin={isAdmin}
        isDeleting={isDeleting}
        onClearSelection={clearSelection}
        onBulkDelete={handleBulkDelete}
      />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 w-10">
                <button
                  onClick={allSelected ? clearSelection : selectAll}
                  className="hover:opacity-70 transition-opacity"
                >
                  {allSelected ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                File Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Size
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Uploaded By
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Location
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Uploaded
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedFiles.map((file, index) => {
              const isOwner = file.uploadedBy.id === currentUserId;
              const canDelete = isAdmin || isOwner;

              return (
                <FileTableRow
                  key={file.id}
                  file={file}
                  index={index}
                  isSelected={selectedFiles.has(file.id)}
                  isOwner={isOwner}
                  canDelete={canDelete}
                  isDeleting={deletingFileId === file.id}
                  onToggleSelect={() => toggleFileSelection(file.id)}
                  onDelete={() => handleDeleteFile(file)}
                />
              );
            })}
          </tbody>
        </table>

        {filteredAndSortedFiles.length === 0 && <EmptyState />}
      </div>
    </motion.div>
  );
}