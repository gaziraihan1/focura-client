import { motion } from 'framer-motion';
import {
  File,
  CheckSquare,
  Square,
  ExternalLink,
  Trash2,
  Loader2,
} from 'lucide-react';
import { LargestFile } from '@/hooks/useStorage';
import { getCategoryColor, formatStorageSize } from '@/hooks/useStoragePage';

interface FileTableRowProps {
  file: LargestFile;
  index: number;
  isSelected: boolean;
  isOwner: boolean;
  canDelete: boolean;
  isDeleting: boolean;
  onToggleSelect: () => void;
  onDelete: () => void;
}

export function FileTableRow({
  file,
  index,
  isSelected,
  isOwner,
  canDelete,
  isDeleting,
  onToggleSelect,
  onDelete,
}: FileTableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b hover:bg-muted/50 transition-colors"
    >
      <td className="py-3 px-2">
        <button
          onClick={onToggleSelect}
          className="hover:opacity-70 transition-opacity"
          disabled={!canDelete}
        >
          {isSelected ? (
            <CheckSquare className="w-4 h-4 text-primary" />
          ) : (
            <Square className={`w-4 h-4 ${!canDelete ? 'opacity-30' : ''}`} />
          )}
        </button>
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <File
            className={`w-4 h-4 shrink-0 ${getCategoryColor(file.mimeType)}`}
          />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{file.originalName}</p>
            <p className="text-xs text-muted-foreground">{file.mimeType}</p>
          </div>
        </div>
      </td>

      <td className="py-3 px-4">
        <span className="text-sm font-medium">
          {formatStorageSize(file.sizeMB)}
        </span>
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <p className="text-sm truncate max-w-[150px]">
            {file.uploadedBy.name || 'Unknown'}
          </p>
          {isOwner && <span className="text-xs text-primary">(You)</span>}
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
              onClick={onDelete}
              disabled={isDeleting}
              className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors disabled:opacity-50"
              title="Delete file"
            >
              {isDeleting ? (
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
}