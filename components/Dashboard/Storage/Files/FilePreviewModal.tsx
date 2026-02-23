'use client';

import { Download } from 'lucide-react';
import { FileWithDetails } from '@/hooks/useFileManagement';
import Image from 'next/image';
import FilePreviewModalHeader from './FilePreviewModalHeader';

interface FilePreviewModalProps {
  file: FileWithDetails;
  onClose: () => void;
}

export function FilePreviewModal({ file, onClose }: FilePreviewModalProps) {
//   const canPreview = 
//     file.mimeType.startsWith('image/') ||
//     file.mimeType.includes('pdf') ||
//     file.mimeType.startsWith('video/') ||
//     file.mimeType.startsWith('audio/');

  const renderPreview = () => {
    if (file.mimeType.startsWith('image/')) {
      return (
        <Image
        width={400}
        height={500}
          src={file.url}
          alt={file.originalName}
          className="max-w-full max-h-[70vh] mx-auto object-contain"
        />
      );
    }

    if (file.mimeType.includes('pdf')) {
      return (
        <iframe
          src={file.url}
          className="w-full h-[70vh] border-0"
          title={file.originalName}
        />
      );
    }

    if (file.mimeType.startsWith('video/')) {
      return (
        <video
          src={file.url}
          controls
          className="max-w-full max-h-[70vh] mx-auto"
        >
          Your browser does not support video playback.
        </video>
      );
    }

    if (file.mimeType.startsWith('audio/')) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <audio src={file.url} controls className="w-full max-w-md">
            Your browser does not support audio playback.
          </audio>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          Preview not available for this file type
        </p>
        <a
          href={file.url}
          download={file.originalName}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download File
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative bg-background border rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <FilePreviewModalHeader file={file} onClose={onClose} />

        {/* Preview */}
        <div className="flex-1 overflow-auto p-6 bg-muted/20">
          {renderPreview()}
        </div>

        {/* Footer Info */}
        {(file.task || file.project) && (
          <div className="px-6 py-3 border-t bg-muted/30">
            <div className="flex items-center gap-4 text-sm">
              {file.project && (
                <div>
                  <span className="text-muted-foreground">Project:</span>
                  <span className="ml-2 font-medium">{file.project.name}</span>
                </div>
              )}
              {file.task && (
                <div>
                  <span className="text-muted-foreground">Task:</span>
                  <span className="ml-2 font-medium">{file.task.title}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
}