"use client";
import { AnnouncementDetail } from "@/components/Dashboard/Workspaces/Announcement/AnnouncementDetail/AnnouncementDetail";
import { useParams } from "next/navigation";



export default function AnnouncementDetailPage() {
    const params = useParams();
  return <AnnouncementDetail id={params.id as string} workspaceSlug={params.workspaceSlug as string} />;
}