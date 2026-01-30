import React from 'react'
import { Activity, MessageSquare, Paperclip } from 'lucide-react';

type TaskTab = "comments" | "activity" |"attachments"
interface TaskTabHeaderProps {
    activeTab: TaskTab;
    setActiveTab: (tab: TaskTab) => void;
    counts: {
        comments: number;
        activity: number;
        attachments: number
    }
}
export default function TaskTabHeader({
    activeTab,
    setActiveTab,
    counts
}: TaskTabHeaderProps) {
  return (
     <div className="border-b border-border overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max">
          {[
            {
              id: "comments" as const,
              label: "Comments",
              icon: MessageSquare,
              count: counts.comments,
            },
            {
              id: "activity" as const,
              label: "Activity",
              icon: Activity,
              count: counts.activity,
            },
            {
              id: "attachments" as const,
              label: "Attachments",
              icon: Paperclip,
              count: counts.attachments,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as "comments" | "activity" | "attachments")
              }
              className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium transition flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary/5 text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label}</span>
              {tab.count > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
)
}
