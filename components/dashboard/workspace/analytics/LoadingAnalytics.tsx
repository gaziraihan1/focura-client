'use client';

import { Loader2, BarChart3 } from 'lucide-react'

export default function LoadingAnalytics() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse" />
          <div className="relative p-4 bg-card border rounded-2xl shadow-sm">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading analytics...</p>
      </div>
    </div>
  )
}
