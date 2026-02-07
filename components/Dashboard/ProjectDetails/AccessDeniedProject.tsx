"use client";

import { motion } from "framer-motion";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface AccessDeniedProjectProps {
  projectName?: string;
  workspaceName?: string;
}

export function AccessDeniedProject({ 
  projectName, 
  workspaceName 
}: AccessDeniedProjectProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full" />
            <div className="relative bg-card border-2 border-destructive/30 rounded-full p-6">
              <ShieldX className="w-16 h-16 text-destructive" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Access Denied
          </h1>
          <p className="text-base text-muted-foreground">
            You don&apos;t have permission to view this project
          </p>
          
          {(projectName || workspaceName) && (
            <div className="pt-2 space-y-1">
              {projectName && (
                <p className="text-sm text-foreground/70">
                  Project: <span className="font-medium text-foreground">{projectName}</span>
                </p>
              )}
              {workspaceName && (
                <p className="text-sm text-foreground/70">
                  Workspace: <span className="font-medium text-foreground">{workspaceName}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-muted/50 border border-border rounded-xl p-4 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            This project is restricted to team members only. If you believe you should have access, 
            please contact the project owner or workspace administrator.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Need help?{" "}
            <button 
              onClick={() => router.push('/support')}
              className="text-primary hover:underline font-medium"
            >
              Contact Support
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}