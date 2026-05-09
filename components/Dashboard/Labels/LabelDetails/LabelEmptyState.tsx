import { Tag } from "lucide-react";

export function LabelEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Tag className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium text-foreground">No tasks yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Tasks assigned to this label (<span className="font-semibold">Related to you</span>) will appear here.
      </p>
    </div>
  );
}