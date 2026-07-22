import { LoadingState as SharedLoadingState } from '@/components/Shared/LoadingState';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <SharedLoadingState />
        <p className="text-sm text-muted-foreground">Loading files...</p>
      </div>
    </div>
  );
}
