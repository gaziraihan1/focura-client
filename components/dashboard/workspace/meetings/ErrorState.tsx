import { Button } from "@/components/ui/Button";

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-8 text-center">
      <p className="text-sm text-destructive mb-3">Failed to load meetings</p>
      <Button variant="ghost" onClick={onRetry} className="text-xs text-muted-foreground underline hover:text-foreground hover:bg-transparent">
        Try again
      </Button>
    </div>
  );
}