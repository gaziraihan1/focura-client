"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Plus, Search } from "lucide-react";

export interface LabelManagementHeaderProps {
  workspaceSlug: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onBack: () => void;
  onCreateLabel: () => void;
}

export function LabelManagementHeader({
  searchQuery,
  onSearchChange,
  onBack,
  onCreateLabel,
}: LabelManagementHeaderProps) {
  return (
    <header className="bg-card rounded-2xl border-border sticky top-0 z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4">
          {/* Title + Back */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-foreground">
                Label Management
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create and manage labels for your workspace
              </p>
            </div>
          </div>

          {/* Search + Action */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search labels..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCreateLabel}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Create Label</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
