import { Crown } from 'lucide-react'
import { EmptyState as SharedEmptyState } from '@/components/Shared/EmptyState'

export default function PerformerEmptyState() {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <SharedEmptyState
        icon={Crown}
        title="Top Performer"
        description="No completed tasks yet"
        className="py-0"
      />
    </div>
  )
}
