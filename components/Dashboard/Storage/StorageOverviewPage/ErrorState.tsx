// components/StorageOverview/ErrorState.tsx
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  error?: Error | null;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold">Failed to load storage data</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {error?.message || 'There was an error loading storage information.'}
          </p>
        </div>
      </div>
    </div>
  );
}