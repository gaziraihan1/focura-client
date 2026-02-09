import React from 'react'
interface PrimaryTaskTabProps {
    activeTab: "all" | "primary";
    primaryTasksContent: React.ReactNode;
}

export default function PrimaryTaskTab({activeTab, primaryTasksContent}: PrimaryTaskTabProps) {
  return (
    <>
    {activeTab === "primary" && (
        <div className="space-y-4">
          {/* Info Banner for Primary Tab */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
            <svg
              className="w-5 h-5 text-primary shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-foreground">
              <p className="font-semibold mb-2">Your Daily Focus</p>
              <div className="space-y-1.5 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Primary:</strong> Your main task for today (one only)
                </p>
                <p>
                  <strong className="text-foreground">Secondary:</strong> Supporting tasks (multiple allowed)
                </p>
                <p className="text-xs opacity-80 mt-2">
                  These tasks are personal to you and reset daily at midnight.
                </p>
              </div>
            </div>
          </div>
          {primaryTasksContent}
        </div>
      )}</>
  )
}
