'use client';

import { useState } from 'react';
import { Download, Trash2, Eye, FileText, Image as ImageIcon, Film, Music, Archive, File } from 'lucide-react';
import { FileWithDetails, useDeleteFile } from '@/hooks/useFileManagement';
import { formatFileSize, formatRelativeTime } from '@/utils/file.utils';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { FilePreviewModal } from './FilePreviewModal';
import Image from 'next/image';

interface FileListProps {
  files: FileWithDetails[];
  isAdmin: boolean;
  workspaceId: string;
}

export function FileList({ files, isAdmin, workspaceId }: FileListProps) {
  const [selectedFile, setSelectedFile] = useState<FileWithDetails | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { mutate: deleteFile, isPending } = useDeleteFile(workspaceId);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (mimeType.startsWith('video/')) return <Film className="w-4 h-4" />;
    if (mimeType.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText className="w-4 h-4" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const handleDelete = () => {
    if (selectedFile) {
      deleteFile(selectedFile.id);
      setShowDeleteModal(false);
      setSelectedFile(null);
    }
  };

  const openDeleteModal = (file: FileWithDetails) => {
    setSelectedFile(file);
    setShowDeleteModal(true);
  };

  const openPreview = (file: FileWithDetails) => {
    setSelectedFile(file);
    setShowPreview(true);
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium hidden md:table-cell">Size</th>
                <th className="text-left px-4 py-3 text-sm font-medium hidden lg:table-cell">Uploaded By</th>
                <th className="text-left px-4 py-3 text-sm font-medium hidden xl:table-cell">Context</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Date</th>
                <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {files.map((file) => {
                const canDelete = isAdmin || file.uploadedBy.id === workspaceId;

                return (
                  <tr key={file.id} className="hover:bg-muted/50 transition-colors">
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="text-muted-foreground shrink-0">
                          {getFileIcon(file.mimeType)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" title={file.originalName}>
                            {file.originalName}
                          </p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Size */}
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                      {formatFileSize(file.size)}
                    </td>

                    {/* Uploaded By */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        {file.uploadedBy.image ? (
                          <Image
                          width={24}
                          height={24}
                            src={file.uploadedBy.image}
                            alt={file.uploadedBy.name || 'User'}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {(file.uploadedBy.name || file.uploadedBy.email).charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="text-sm truncate max-w-[150px]">
                          {file.uploadedBy.name || file.uploadedBy.email}
                        </span>
                      </div>
                    </td>

                    {/* Context */}
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden xl:table-cell">
                      {file.task && (
                        <p className="truncate max-w-[200px]" title={file.task.title}>
                          📋 {file.task.title}
                        </p>
                      )}
                      {file.project && (
                        <p className="truncate max-w-[200px]" title={file.project.name}>
                          📁 {file.project.name}
                        </p>
                      )}
                      {!file.task && !file.project && <span className="text-muted-foreground/50">—</span>}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(file.uploadedAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openPreview(file)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={file.url}
                          download={file.originalName}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        {canDelete && (
                          <button
                            onClick={() => openDeleteModal(file)}
                            disabled={isPending}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showPreview && selectedFile && (
        <FilePreviewModal file={selectedFile} onClose={() => setShowPreview(false)} />
      )}
      {showDeleteModal && selectedFile && (
        <DeleteConfirmModal
          fileName={selectedFile.originalName}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isPending}
        />
      )}
    </>
  );
}