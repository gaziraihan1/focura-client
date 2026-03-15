"use client";

import { useState } from "react";

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function getDateStr() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

export function DashboardGreeting({ userName }: { userName?: string | null }) {
  const [greeting] = useState(getGreeting);
  const [dateStr]  = useState(getDateStr);

  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {greeting}{userName ? `, ${userName.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s your Focura hub — pick a workspace to dive in.
        </p>
      </div>
      <span className="text-xs text-muted-foreground bg-card border rounded-md px-3 py-1.5">
        {dateStr}
      </span>
    </div>
  );
}