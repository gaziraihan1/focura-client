"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import FavoritesPanel from "@/components/Dashboard/ProjectDetails/FavoritesPanel";

export default function ProjectFavoritesPage() {
  const params = useParams();
  const router = useRouter();
  const projectSlug = params?.projectSlug as string;
  const workspaceSlug = params?.workspaceSlug as string;
  const base = `/dashboard/workspaces/${workspaceSlug}/projects/${projectSlug}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Star size={16} className="text-amber-500" />
        <h1 className="text-xl font-bold text-foreground">Favorites</h1>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Star projects to access them quickly. Organize favorites into groups.
      </p>

      <FavoritesPanel />

      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">
          Favorites are personal and sync across all your workspaces.
        </p>
        <button
          onClick={() => router.push(base)}
          className="mt-2 text-xs text-primary font-semibold hover:underline"
        >
          Go to project overview
        </button>
      </div>
    </div>
  );
}
