import { FileWithDetails } from "@/hooks/useFileManagement";
import { Download, Eye, Trash2 } from "lucide-react";
import React from "react";

interface FileCardOverlayProps {
  canDelete: boolean;
  onDeleteModal: (v: boolean) => void;
  onShowPreview: (v: boolean) => void;
  file: FileWithDetails;
  isPending: boolean;
}

export default function FileCardOverlay({
  canDelete,
  onDeleteModal,
  file,
  isPending,
  onShowPreview,
}: FileCardOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
      <button
        onClick={() => onShowPreview(true)}
        className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        title="Preview"
      >
        <Eye className="w-4 h-4 text-gray-900" />
      </button>
      <a
        href={file.url}
        download={file.originalName}
        className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        title="Download"
      >
        <Download className="w-4 h-4 text-gray-900" />
      </a>
      {canDelete && (
        <button
          onClick={() => onDeleteModal(true)}
          disabled={isPending}
          className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors disabled:opacity-50"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      )}
    </div>
  );
}
