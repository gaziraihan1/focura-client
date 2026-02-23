"use client";

import { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Archive,
  File,
} from "lucide-react";
import { FileWithDetails, useDeleteFile } from "@/hooks/useFileManagement";
import { isImageFile } from "@/utils/file.utils";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { FilePreviewModal } from "./FilePreviewModal";
import Image from "next/image";
import FileCardOverlay from "./FileCardOverlay";
import FileCardInfo from "./FileCardInfo";

interface FileCardProps {
  file: FileWithDetails;
  isAdmin: boolean;
  workspaceId: string;
}

export function FileCard({ file, isAdmin, workspaceId }: FileCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { mutate: deleteFile, isPending } = useDeleteFile(workspaceId);

  const canDelete = isAdmin || file.uploadedBy.id === workspaceId;

  const getFileIcon = () => {
    if (file.mimeType.startsWith("image/"))
      return <ImageIcon className="w-6 h-6" />;
    if (file.mimeType.startsWith("video/")) return <Film className="w-6 h-6" />;
    if (file.mimeType.startsWith("audio/"))
      return <Music className="w-6 h-6" />;
    if (file.mimeType.includes("pdf") || file.mimeType.includes("document"))
      return <FileText className="w-6 h-6" />;
    if (file.mimeType.includes("zip") || file.mimeType.includes("rar"))
      return <Archive className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const handleDelete = () => {
    deleteFile(file.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-md transition-all">
        <div className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden">
          {isImageFile(file.mimeType) ? (
            <Image
              width={400}
              height={400}
              src={file.url}
              alt={file.originalName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="text-muted-foreground">{getFileIcon()}</div>
          )}

          <FileCardOverlay
            canDelete={canDelete}
            file={file}
            onDeleteModal={setShowDeleteModal}
            isPending={isPending}
            onShowPreview={setShowPreview}
          />
        </div>

        <FileCardInfo file={file} />
      </div>

      {showPreview && (
        <FilePreviewModal file={file} onClose={() => setShowPreview(false)} />
      )}
      {showDeleteModal && (
        <DeleteConfirmModal
          fileName={file.originalName}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isPending}
        />
      )}
    </>
  );
}
