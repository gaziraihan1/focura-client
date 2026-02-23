// hooks/useLargestFilesTable.ts
import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { LargestFile } from '@/hooks/useStorage';
import { useStoragePage } from '@/hooks/useStoragePage';
import { useBulkDeleteFiles, useDeleteFile } from '@/hooks/useStorage';

export function useLargestFilesTable(
  files: LargestFile[],
  workspaceId: string,
  isAdmin: boolean
) {
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

  // Count deletable files
  const deletableCount = Array.from(selectedFiles).filter((fileId) => {
    const file = files.find((f) => f.id === fileId);
    return file && (isAdmin || canDeleteFile(file));
  }).length;

  const handleBulkDelete = useCallback(async () => {
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
  }, [selectedFiles, isAdmin, bulkDelete, clearSelection]);

  const handleDeleteFile = useCallback(
    async (file: LargestFile) => {
      if (!isAdmin && !canDeleteFile(file)) {
        return;
      }

      if (
        confirm(
          'Are you sure you want to delete this file? This action cannot be undone.'
        )
      ) {
        setDeletingFileId(file.id);
        try {
          await deleteFile.mutateAsync(file.id);
        } finally {
          setDeletingFileId(null);
        }
      }
    },
    [isAdmin, canDeleteFile, deleteFile]
  );

  return {
    currentUserId,
    selectedFiles,
    filteredAndSortedFiles,
    selectedFilesSize,
    deletableCount,
    deletingFileId,
    filterType,
    isDeleting: bulkDelete.isPending,
    toggleFileSelection,
    selectAll,
    clearSelection,
    setFilterType,
    canDeleteFile,
    handleBulkDelete,
    handleDeleteFile,
  };
}