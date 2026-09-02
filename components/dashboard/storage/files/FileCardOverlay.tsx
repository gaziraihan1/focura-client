import { FileWithDetails } from "@/hooks/useFileManagement";
import { Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    <div className="absolute inset-0 bg-black/60 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        onClick={() => onShowPreview(true)}
        className="h-auto w-auto rounded-full bg-white/90 p-2 hover:bg-white"
        title="Preview"
      >
        <Eye className="w-4 h-4 text-gray-900" />
      </Button>
      <a
        href={file.url}
        download={file.originalName}
        className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        title="Download"
      >
        <Download className="w-4 h-4 text-gray-900" />
      </a>
      {canDelete && (
        <Button
          variant="ghost"
          onClick={() => onDeleteModal(true)}
          disabled={isPending}
          className="h-auto w-auto rounded-full bg-white/90 p-2 hover:bg-white"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      )}
    </div>
  );
}
