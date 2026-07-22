import { LoadingState as SharedLoadingState } from '@/components/Shared/LoadingState';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading workspaces...' }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <SharedLoadingState />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
