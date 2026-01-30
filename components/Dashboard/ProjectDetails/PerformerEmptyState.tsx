import { Crown } from 'lucide-react'
import React from 'react'

export default function PerformerEmptyState() {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Top Performer</span>
                  </div>
                  <p className="text-sm text-muted-foreground">No completed tasks yet</p>
                </div>
  )
}
