"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { usePathname } from "next/navigation";
import { api } from "@/lib/axios";
interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  timezone?: string;
  role: string;
  createdAt: string;
  ownedWorkspaces: Array<{
    id: string;
    plan: string;
    maxStorage: number;
  }>;
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>()
  const pathname = usePathname();
  useEffect(() => {
      fetchProfile();
    }, []);
  
  
  const fetchProfile = async () => {
    try {
      const response = await api.get<{
        user: UserProfile;
      }>('/api/user/profile');
      
      if (response.data) {
        setProfile(response.data.user);
        
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
    }
  };

  const segments = pathname.split("/").filter(Boolean);

  const isWorkspaceRoute =
    segments[0] === "dashboard" &&
    segments[1] === "workspaces" ;
  const thirdSegment = segments[2];

  const hideLayout =
    isWorkspaceRoute &&
    thirdSegment &&                     
    thirdSegment !== "new-workspace";    

  if (hideLayout) {
    return <>{children}</>; 
  }


  return (
    <div className="min-h-screen bg-background">
    
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
      

        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
          user={profile}
        />
        

        <main className="flex-1 p-5 lg:py-8 lg:px-5">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}