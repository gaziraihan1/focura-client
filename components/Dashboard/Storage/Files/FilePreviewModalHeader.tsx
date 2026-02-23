import { FileWithDetails } from '@/hooks/useFileManagement'
import { formatFileSize, formatRelativeTime } from '@/utils/file.utils'
import { Download, ExternalLink, X } from 'lucide-react'
import React from 'react'

export default function FilePreviewModalHeader({file, onClose} : {file: FileWithDetails; onClose: () => void}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{file.originalName}</h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>{formatRelativeTime(file.uploadedAt)}</span>
              <span>•</span>
              <span>by {file.uploadedBy.name || file.uploadedBy.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <a
              href={file.url}
              download={file.originalName}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </a>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
  )
}
