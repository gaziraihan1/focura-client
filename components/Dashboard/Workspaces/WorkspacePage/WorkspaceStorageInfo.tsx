import React from 'react'

export default function WorkspaceStorageInfo({maxStorage}: {maxStorage: number}) {
  return (
    <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card border border-border">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
            Storage
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2 gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">Used Storage</span>
                <span className="text-xs sm:text-sm text-foreground font-medium">
                  0 MB / {maxStorage} MB
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>
        </div>
  )
}
