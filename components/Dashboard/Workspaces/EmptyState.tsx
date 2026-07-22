import Link from 'next/link'
import { EmptyState as SharedEmptyState } from '@/components/Shared/EmptyState'
import { FolderX } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <SharedEmptyState
        icon={FolderX}
        title="Workspace not found"
        description="This workspace doesn't exist or you don't have access to it."
      />
      <Link
        href="/dashboard/workspaces"
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        Back to Workspaces
      </Link>
    </div>
  )
}
