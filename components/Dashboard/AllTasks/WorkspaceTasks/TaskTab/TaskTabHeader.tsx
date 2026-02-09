import React from 'react'

type ActiveTab = "all" | "primary";
interface TaskTabHeaderProps {
    activeTab: ActiveTab;
    onActiveTab: (v: ActiveTab) => void;
}

export default function TaskTabHeader({onActiveTab, activeTab}: TaskTabHeaderProps) {
  return (
    <div className="border-b border-border">
        <div className="flex gap-2">
          <button
            onClick={() => onActiveTab("all")}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeTab === "all"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Tasks
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => onActiveTab("primary")}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeTab === "primary"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Primary
            {activeTab === "primary" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>
  )
}
