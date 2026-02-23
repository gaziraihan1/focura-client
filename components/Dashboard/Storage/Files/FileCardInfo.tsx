import { FileWithDetails } from '@/hooks/useFileManagement'
import { formatFileSize, formatRelativeTime } from '@/utils/file.utils'
import Image from 'next/image'
import React from 'react'



export default function FileCardInfo({file}: {file: FileWithDetails}) {
  return (
    <div className="p-3">
              <p className="text-sm font-medium truncate" title={file.originalName}>
                {file.originalName}
              </p>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{formatFileSize(file.size)}</span>
                <span>{formatRelativeTime(file.uploadedAt)}</span>
              </div>
    
              {/* Uploader */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                {file.uploadedBy.image ? (
                  <Image
                  width={20}
                  height={20}
                    src={file.uploadedBy.image}
                    alt={file.uploadedBy.name || 'User'}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {(file.uploadedBy.name || file.uploadedBy.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground truncate">
                  {file.uploadedBy.name || file.uploadedBy.email}
                </span>
              </div>
    
              {/* Context info */}
              {(file.task || file.project) && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {file.task && (
                    <p className="truncate" title={`Task: ${file.task.title}`}>
                      📋 {file.task.title}
                    </p>
                  )}
                  {file.project && (
                    <p className="truncate" title={`Project: ${file.project.name}`}>
                      📁 {file.project.name}
                    </p>
                  )}
                </div>
              )}
            </div>
  )
}
