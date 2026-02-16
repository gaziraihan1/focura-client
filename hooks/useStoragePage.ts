'use client';

import { useState, useMemo } from 'react';
import { LargestFile, StorageInfo } from './useStorage';

export interface StorageUIState {
  selectedFiles: Set<string>;
  filterType: string;
  sortBy: 'size' | 'date' | 'name';
  sortOrder: 'asc' | 'desc';
}

export function useStoragePage(files: LargestFile[] = [], currentUserId?: string) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'size' | 'date' | 'name'>('size');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Toggle file selection
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  // Get category from mime type
  const getCategory = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'images';
    if (mimeType.startsWith('video/')) return 'videos';
    if (mimeType.includes('pdf')) return 'pdfs';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'documents';
    return 'other';
  };

  // Filter files - React Compiler compatible
  const filteredFiles = useMemo(() => {
    if (filterType === 'all') return files;
    return files.filter((file) => getCategory(file.mimeType) === filterType);
  }, [files, filterType]);

  // Sort files - React Compiler compatible (removed nested useMemo)
  const filteredAndSortedFiles = (() => {
    const sorted = [...filteredFiles];
    sorted.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'size') {
        comparison = a.size - b.size;
      } else if (sortBy === 'date') {
        comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      } else if (sortBy === 'name') {
        comparison = a.originalName.localeCompare(b.originalName);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  })();

  // Calculate selected files total size
  const selectedFilesSize = useMemo(() => {
    return Array.from(selectedFiles).reduce((total, fileId) => {
      const file = files.find((f) => f.id === fileId);
      return total + (file?.sizeMB || 0);
    }, 0);
  }, [selectedFiles, files]);

  // Check if user can delete a file (own file or will be handled by backend for admins)
  const canDeleteFile = (file: LargestFile) => {
    if (!currentUserId) return false;
    return file.uploadedBy.id === currentUserId;
  };

  // Get only deletable files from selection
  const getDeletableFiles = () => {
    return Array.from(selectedFiles).filter((fileId) => {
      const file = files.find((f) => f.id === fileId);
      return file && canDeleteFile(file);
    });
  };

  // Select all files (uses computed value)
  const selectAll = () => {
    setSelectedFiles(new Set(filteredAndSortedFiles.map((f) => f.id)));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedFiles(new Set());
  };

  return {
    selectedFiles,
    filterType,
    sortBy,
    sortOrder,
    filteredAndSortedFiles,
    selectedFilesSize,
    toggleFileSelection,
    selectAll,
    clearSelection,
    setFilterType,
    setSortBy,
    setSortOrder,
    canDeleteFile,
    getDeletableFiles,
  };
}

// Storage warning levels - Updated for workspace context
export function useStorageWarning(storageInfo?: StorageInfo) {
  return useMemo(() => {
    if (!storageInfo) return { level: 'normal', message: null };

    const { percentage, workspaceName } = storageInfo;

    if (percentage >= 95) {
      return {
        level: 'critical',
        message: `${workspaceName} storage is almost full! Delete files or upgrade the workspace plan.`,
      };
    }

    if (percentage >= 80) {
      return {
        level: 'warning',
        message: `${workspaceName} storage usage is high. Consider cleaning up files.`,
      };
    }

    return { level: 'normal', message: null };
  }, [storageInfo]);
}

// Format bytes to human readable
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Get plan limits - Updated for workspace plans
export function getPlanLimits(plan: string) {
  const limits: Record<string, { storage: number; maxFileSize: number; features: string[] }> = {
    FREE: {
      storage: 1024, // 1 GB
      maxFileSize: 5,
      features: ['Basic file storage', 'Up to 5 MB per file', '5 team members'],
    },
    PRO: {
      storage: 10240, // 10 GB
      maxFileSize: 25,
      features: ['Enhanced storage', 'Up to 25 MB per file', 'Weekly backups', '20 team members'],
    },
    BUSINESS: {
      storage: 102400, // 100 GB
      maxFileSize: 100,
      features: [
        'Large storage',
        'Up to 100 MB per file',
        'Daily backups',
        'Version history',
        '50 team members',
      ],
    },
    ENTERPRISE: {
      storage: 1048576, // 1 TB
      maxFileSize: 500,
      features: [
        'Unlimited storage',
        'Up to 500 MB per file',
        'Real-time backups',
        'Unlimited version history',
        'Unlimited team members',
        'Priority support',
      ],
    },
  };

  return limits[plan] || limits.FREE;
}

// Get category icon
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    images: 'Image',
    videos: 'Video',
    pdfs: 'FileText',
    documents: 'FileText',
    other: 'File',
  };
  return icons[category] || 'File';
}

// Get category color
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    images: 'text-blue-600 dark:text-blue-400',
    videos: 'text-purple-600 dark:text-purple-400',
    pdfs: 'text-red-600 dark:text-red-400',
    documents: 'text-green-600 dark:text-green-400',
    other: 'text-gray-600 dark:text-gray-400',
  };
  return colors[category] || colors.other;
}

// Format storage size for display
export function formatStorageSize(mb: number): string {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(2)} GB`;
  }
  return `${mb.toFixed(2)} MB`;
}

// Get role badge color
export function getRoleBadgeColor(role: string): string {
  const colors: Record<string, string> = {
    OWNER: 'bg-amber-500/10 text-amber-600 dark:text-amber-500',
    ADMIN: 'bg-blue-500/10 text-blue-600 dark:text-blue-500',
    MEMBER: 'bg-green-500/10 text-green-600 dark:text-green-500',
    GUEST: 'bg-gray-500/10 text-gray-600 dark:text-gray-500',
  };
  return colors[role] || colors.GUEST;
}

// Get storage status color
export function getStorageStatusColor(percentage: number): {
  text: string;
  bg: string;
  border: string;
} {
  if (percentage >= 95) {
    return {
      text: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
    };
  }
  if (percentage >= 80) {
    return {
      text: 'text-amber-600 dark:text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    };
  }
  return {
    text: 'text-green-600 dark:text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  };
}