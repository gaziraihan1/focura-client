import { format } from 'date-fns';
import React from 'react'

interface WorkspaceInformationProps {
    name: string | null;
    email?: string;
    createdAt: string;
    isPublic: boolean;
}

export default function WorkspaceInformation({name, email, createdAt, isPublic}: WorkspaceInformationProps) {
  return (
     <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card border border-border">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Information
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs sm:text-sm text-muted-foreground">Owner</span>
                  <span className="text-xs sm:text-sm text-foreground font-medium truncate max-w-[60%] text-right">
                    {name || email}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs sm:text-sm text-muted-foreground">Created</span>
                  <span className="text-xs sm:text-sm text-foreground font-medium">
                    {format(new Date(createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs sm:text-sm text-muted-foreground">Visibility</span>
                  <span className="text-xs sm:text-sm text-foreground font-medium">
                    {isPublic ? "Public" : "Private"}
                  </span>
                </div>
              </div>
            </div>
  )
}
