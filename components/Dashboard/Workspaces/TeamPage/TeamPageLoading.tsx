import React from 'react'

export default function TeamPageLoading() {
  return (
    <div className="min-h-[400px] flex flex-col gap-6 p-4 sm:p-6">
        <div className="flex flex-col gap-1.5">
          <div className="h-7 w-40 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-64 rounded-md bg-muted animate-pulse" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>

        <div className="flex gap-2 border-b border-border pb-0">
          <div className="h-9 w-28 rounded-t-lg bg-muted animate-pulse" />
          <div className="h-9 w-24 rounded-t-lg bg-muted animate-pulse" />
        </div>

        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
  )
}
