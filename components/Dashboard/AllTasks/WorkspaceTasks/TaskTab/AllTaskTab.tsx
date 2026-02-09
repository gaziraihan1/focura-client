import React from 'react'

interface AllTaskTabProps {
    activeTab: "all" | "primary";
    allTasksContent: React.ReactNode;
}

export default function AllTaskTab({activeTab, allTasksContent}: AllTaskTabProps) {
  return (
    <>
    {activeTab === "all" && (
        <div className="space-y-4">
          {/* Info Banner for All Tasks */}
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-foreground">
              <p className="font-semibold mb-2">How to organize your tasks:</p>
              <ul className="space-y-1.5 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>
                    Click the{" "}
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-purple-500 text-white text-xs font-bold">
                      +
                    </span>{" "}
                    purple button to set your <strong className="text-foreground">Primary</strong> task (only one allowed)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>
                    Click the{" "}
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-amber-500 text-white text-xs font-bold">
                      +
                    </span>{" "}
                    amber button to add <strong className="text-foreground">Secondary</strong> tasks (multiple allowed)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>Your primary and secondary tasks reset daily at midnight</span>
                </li>
              </ul>
            </div>
          </div>
          {allTasksContent}
        </div>
      )}</>
  )
}
