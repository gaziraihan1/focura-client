// app/dashboard/workspaces/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Users,
  FolderKanban,
  Settings,
  Crown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useWorkspaces } from "@/hooks/useWorkspace";

export default function WorkspacesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  
  // ✅ Fetch all workspaces
  const { data: workspaces = [], isLoading, isError } = useWorkspaces();

  // Filter workspaces by search
  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPlanBadge = (plan: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      FREE: { color: "bg-gray-500/10 text-gray-500", label: "Free" },
      PRO: { color: "bg-blue-500/10 text-blue-500", label: "Pro" },
      BUSINESS: { color: "bg-purple-500/10 text-purple-500", label: "Business" },
      ENTERPRISE: { color: "bg-orange-500/10 text-orange-500", label: "Enterprise" },
    };
    return badges[plan] || badges.FREE;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workspaces</h1>
          <p className="text-muted-foreground mt-1">
            Manage and switch between your workspaces
          </p>
        </div>
        
        <button
          onClick={() => router.push("/dashboard/workspaces/new-workspace")}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
        >
          <Plus size={18} />
          Create Workspace
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search workspaces..."
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none"
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        // Error State
        <div className="text-center py-12 rounded-xl bg-card border border-border">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load workspaces</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      ) : filteredWorkspaces.length === 0 ? (
        // Empty State
        <div className="text-center py-12 rounded-xl bg-card border border-border">
          <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchQuery ? "No workspaces found" : "No workspaces yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Try adjusting your search"
              : "Create your first workspace to get started"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => router.push("/dashboard/workspaces/new-workspace")}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Create Workspace
            </button>
          )}
        </div>
      ) : (
        // Workspace Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkspaces.map((workspace, index) => (
            <motion.div
              key={workspace.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/dashboard/workspaces/${workspace.slug}`}>
                <div className="group p-6 rounded-xl bg-card border border-border hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Logo/Icon */}
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold text-white"
                        style={{ backgroundColor: workspace.color || "#667eea" }}
                      >
                        {workspace.logo || workspace.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition">
                          {workspace.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          /{workspace.slug}
                        </p>
                      </div>
                    </div>

                    {/* Owner Badge */}
                    {workspace.members.find(
                      (m) => m.role === "OWNER"
                    ) && (
                      <div className="p-1.5 rounded-lg bg-yellow-500/10">
                        <Crown size={14} className="text-yellow-500" />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {workspace.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {workspace.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FolderKanban size={14} />
                      <span>{workspace._count.projects} projects</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{workspace._count.members} members</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    {/* Plan Badge */}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getPlanBadge(workspace.plan).color
                      }`}
                    >
                      {getPlanBadge(workspace.plan).label}
                    </span>

                    {/* Settings Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/dashboard/workspaces/${workspace.slug}/settings`);
                      }}
                      className="p-2 rounded-lg hover:bg-accent transition"
                    >
                      <Settings size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}