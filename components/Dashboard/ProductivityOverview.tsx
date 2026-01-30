import { TrendingUp } from 'lucide-react'
import React from 'react'

export default function ProductivityOverview() {
  return (
    <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Productivity Overview
          </h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm rounded-lg bg-accent text-foreground">
              Week
            </button>
            <button className="px-3 py-1.5 text-sm rounded-lg hover:bg-accent text-muted-foreground transition">
              Month
            </button>
            <button className="px-3 py-1.5 text-sm rounded-lg hover:bg-accent text-muted-foreground transition">
              Year
            </button>
          </div>
        </div>

        <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
          <div className="text-center">
            <TrendingUp size={48} className="mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-4">
              Chart visualization will go here
            </p>
          </div>
        </div>
      </div>
  )
}
