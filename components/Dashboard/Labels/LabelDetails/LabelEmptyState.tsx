import { Tag } from "lucide-react";
import { EmptyState as SharedEmptyState } from "@/components/Shared/EmptyState";

export function LabelEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
      <SharedEmptyState
        icon={Tag}
        title="No tasks yet"
        description='Tasks assigned to this label will appear here.'
      />
    </div>
  );
}
