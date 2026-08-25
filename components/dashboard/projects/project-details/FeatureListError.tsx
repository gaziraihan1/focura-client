"use client";

import { AlertCircle } from "lucide-react";

interface FeatureListErrorProps {
  feature: string;
  /** The query error, used to distinguish access denials from transient failures. */
  error?: unknown;
}

export default function FeatureListError({ feature, error }: FeatureListErrorProps) {
  const status = (error as { response?: { status?: number } } | undefined)?.response?.status;
  const denied = status === 403 || status === 404;
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">
        {denied
          ? `Couldn't load ${feature}. You may not have access to this project.`
          : `Couldn't load ${feature}. Please try again.`}
      </p>
    </div>
  );
}
