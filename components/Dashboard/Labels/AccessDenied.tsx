import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import React from 'react'
interface AccessDeniedProps {
    title: string;
    desc: string;
    btnText: string;
    workspaceSlug: string;
}

export default function AccessDenied({title, desc, btnText, workspaceSlug}: AccessDeniedProps) {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground mb-6">
            {desc}
          </p>
          <button
            onClick={() => router.push(`/dashboard/workspaces/${workspaceSlug}`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {btnText}
          </button>
        </div>
      </div>
  )
}


