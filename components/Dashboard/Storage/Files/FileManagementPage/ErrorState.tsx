// components/FileManagement/ErrorState.tsx
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: any;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const errorMessage =
    error?.response?.data?.message || 'Failed to load files';
  const isAccessDenied =
    errorMessage.toLowerCase().includes('access') ||
    errorMessage.toLowerCase().includes('permission');

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <AlertTriangle
          className={`w-12 h-12 ${
            isAccessDenied ? 'text-amber-500' : 'text-destructive'
          }`}
        />
        <div>
          <h3 className="text-lg font-semibold">
            {isAccessDenied ? 'Access Restricted' : 'Failed to Load Files'}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">{errorMessage}</p>
          {isAccessDenied && (
            <p className="text-xs text-muted-foreground mt-2">
              Contact your workspace admin to request file access.
            </p>
          )}
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}