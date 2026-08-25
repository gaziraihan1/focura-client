"use client";

import { useState } from "react";
import TaskTabHeader from "./TaskTab/TaskTabHeader";
import AllTaskTab from "./TaskTab/AllTaskTab";
import PrimaryTaskTab from "./TaskTab/PrimaryTaskTab";

interface TaskTabsProps {
  allTasksContent: React.ReactNode;
  primaryTasksContent: React.ReactNode;
}

export function TaskTabs({ allTasksContent, primaryTasksContent }: TaskTabsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "primary">("all");

  return (
    <div className="space-y-4">
      {/* Tabs Header */}
      <TaskTabHeader onActiveTab={setActiveTab} activeTab={activeTab} />

      {/* Tab Content */}
      <AllTaskTab activeTab={activeTab} allTasksContent={allTasksContent} />

      <PrimaryTaskTab activeTab={activeTab} primaryTasksContent={primaryTasksContent} />
    </div>
  );
}