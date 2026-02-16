'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  File,
  Trash2,
  ExternalLink,
  CheckSquare,
  Square,
  Loader2,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { LargestFile } from '@/hooks/useStorage';
import { useStoragePage, getCategoryColor, formatStorageSize } from '@/hooks/useStoragePage';
import { useBulkDeleteFiles, useDeleteFile } from '@/hooks/useStorage';

interface LargestFilesTableProps {
  files: LargestFile[];
  workspaceId: string;
  isAdmin: boolean;
}

export function LargestFilesTable({ files, workspaceId, isAdmin }: LargestFilesTableProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const {
    selectedFiles,
    filteredAndSortedFiles,
    selectedFilesSize,
    toggleFileSelection,
    selectAll,
    clearSelection,
    filterType,
    setFilterType,
    canDeleteFile,
  } = useStoragePage(files, currentUserId);

  const bulkDelete = useBulkDeleteFiles(workspaceId);
  const deleteFile = useDeleteFile(workspaceId);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;

    const fileCount = selectedFiles.size;
    const canDeleteAll = isAdmin;

    if (
      confirm(
        canDeleteAll
          ? `Are you sure you want to delete ${fileCount} file(s)? This action cannot be undone.`
          : `You can only delete your own files. Continue?`
      )
    ) {
      await bulkDelete.mutateAsync(Array.from(selectedFiles));
      clearSelection();
    }
  };

  const handleDeleteFile = async (file: LargestFile) => {
    if (!isAdmin && !canDeleteFile(file)) {
      return;
    }

    if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      setDeletingFileId(file.id);
      try {
        await deleteFile.mutateAsync(file.id);
      } finally {
        setDeletingFileId(null);
      }
    }
  };

  const filters = [
    { value: 'all', label: 'All Files' },
    { value: 'images', label: 'Images' },
    { value: 'videos', label: 'Videos' },
    { value: 'pdfs', label: 'PDFs' },
    { value: 'documents', label: 'Documents' },
    { value: 'other', label: 'Other' },
  ];

  // Count deletable files
  const deletableCount = Array.from(selectedFiles).filter((fileId) => {
    const file = files.find((f) => f.id === fileId);
    return file && (isAdmin || canDeleteFile(file));
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border rounded-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Largest Files</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage workspace storage</p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          {filters.map((filter) => (
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

      {/* Admin Badge */}
      {isAdmin && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <p className="text-sm text-blue-600 dark:text-blue-500">
            <span className="font-medium">Admin Mode:</span> You can delete any file in this workspace
          </p>
        </div>
      )}

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedFiles.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-muted/50 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedFiles.size} file(s) selected
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatStorageSize(selectedFilesSize)}
                </span>
                {!isAdmin && deletableCount < selectedFiles.size && (
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
                    <AlertCircle className="w-3 h-3" />
                    <span className="text-xs">
                      Only {deletableCount} file(s) can be deleted
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearSelection}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-background hover:bg-muted transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDelete.isPending || deletableCount === 0}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {bulkDelete.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                  Delete {isAdmin ? 'Selected' : 'My Files'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 w-10">
                <button
                  onClick={selectedFiles.size === filteredAndSortedFiles.length ? clearSelection : selectAll}
                  className="hover:opacity-70 transition-opacity"
                >
                  {selectedFiles.size === filteredAndSortedFiles.length ? (
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
                <motion.tr
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-2">
                    <button
                      onClick={() => toggleFileSelection(file.id)}
                      className="hover:opacity-70 transition-opacity"
                      disabled={!canDelete}
                    >
                      {selectedFiles.has(file.id) ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className={`w-4 h-4 ${!canDelete ? 'opacity-30' : ''}`} />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <File className={`w-4 h-4 shrink-0 ${getCategoryColor(file.mimeType)}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{file.originalName}</p>
                        <p className="text-xs text-muted-foreground">{file.mimeType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">{formatStorageSize(file.sizeMB)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm truncate max-w-[150px]">
                        {file.uploadedBy.name || 'Unknown'}
                      </p>
                      {isOwner && (
                        <span className="text-xs text-primary">(You)</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      {file.task && (
                        <p className="text-muted-foreground truncate max-w-[200px]">
                          Task: {file.task.title}
                        </p>
                      )}
                      {file.project && (
                        <p className="text-muted-foreground truncate max-w-[200px]">
                          Project: {file.project.name}
                        </p>
                      )}
                      {!file.task && !file.project && (
                        <p className="text-muted-foreground">Workspace</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(file.uploadedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="View file"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteFile(file)}
                          disabled={deletingFileId === file.id}
                          className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors disabled:opacity-50"
                          title="Delete file"
                        >
                          {deletingFileId === file.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {filteredAndSortedFiles.length === 0 && (
          <div className="text-center py-12">
            <File className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No files found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}