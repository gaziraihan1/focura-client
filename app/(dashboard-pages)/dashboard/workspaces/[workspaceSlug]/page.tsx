// app/dashboard/workspaces/[slug]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Settings,
  Users,
  FolderKanban,
  Plus,
  // MoreVertical,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Crown,
  Shield,
  UserCircle,
  Activity,
  LucideIcon,
  Mail,
  X,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import {
  useWorkspace,
  useWorkspaceStats,
  useWorkspaceMembers,
  useInviteMember,
  useRemoveMember,
  useUpdateMemberRole,
} from "@/hooks/useWorkspace";
import { format } from "date-fns";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params.workspaceSlug as string;

  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "members">("overview");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER" | "GUEST">("MEMBER");

  // Fetch workspace data
  const { data: workspace, isLoading, isError } = useWorkspace(slug);
  const { data: stats } = useWorkspaceStats(workspace?.id || "");
  const { data: members = [] } = useWorkspaceMembers(workspace?.id || "");

  // Mutations
  const inviteMember = useInviteMember();
  const removeMember = useRemoveMember();
  const updateMemberRole = useUpdateMemberRole();

  // Get current user's role
  const currentMember = members.find((m) => m.user.id === session?.user?.id);
  const currentUserRole = currentMember?.role;
  const isOwner = currentUserRole === "OWNER";
  const isAdmin = currentUserRole === "ADMIN" || isOwner;

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { icon: LucideIcon; color: string; label: string }> = {
      OWNER: { icon: Crown, color: "bg-yellow-500/10 text-yellow-500", label: "Owner" },
      ADMIN: { icon: Shield, color: "bg-purple-500/10 text-purple-500", label: "Admin" },
      MEMBER: { icon: UserCircle, color: "bg-blue-500/10 text-blue-500", label: "Member" },
      GUEST: { icon: UserCircle, color: "bg-gray-500/10 text-gray-500", label: "Guest" },
    };
    return badges[role] || badges.MEMBER;
  };

  const getPlanBadge = (plan: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      FREE: { color: "bg-gray-500/10 text-gray-500", label: "Free Plan" },
      PRO: { color: "bg-blue-500/10 text-blue-500", label: "Pro Plan" },
      BUSINESS: { color: "bg-purple-500/10 text-purple-500", label: "Business" },
      ENTERPRISE: { color: "bg-orange-500/10 text-orange-500", label: "Enterprise" },
    };
    return badges[plan] || badges.FREE;
  };

  const handleInvite = async () => {
    if (!workspace || !inviteEmail) return;

    try {
      await inviteMember.mutateAsync({
        workspaceId: workspace.id,
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail("");
      setShowInviteModal(false);
    } catch (error) {
      console.error("Invite error:", error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!workspace || !confirm("Remove this member?")) return;

    try {
      await removeMember.mutateAsync({
        workspaceId: workspace.id,
        memberId,
      });
    } catch (error) {
      console.error("Remove member error:", error);
    }
  };

  const handleUpdateRole = async (memberId: string, role: "ADMIN" | "MEMBER" | "GUEST") => {
    if (!workspace) return;

    try {
      await updateMemberRole.mutateAsync({
        workspaceId: workspace.id,
        memberId,
        role,
      });
    } catch (error) {
      console.error("Update role error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Workspace not found</h2>
        <p className="text-muted-foreground mb-6">
          This workspace doesn&apos;t exist or you don&apos;t have access to it
        </p>
        <button
          onClick={() => router.push("/dashboard/workspaces")}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Back to Workspaces
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Back Button */}
          <button
            onClick={() => router.push("/dashboard/workspaces")}
            className="p-2 rounded-lg hover:bg-accent transition"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>

          {/* Workspace Info */}
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-lg"
              style={{ backgroundColor: workspace.color || "#667eea" }}
            >
              {workspace.logo || workspace.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-foreground">{workspace.name}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    getPlanBadge(workspace.plan).color
                  }`}
                >
                  {getPlanBadge(workspace.plan).label}
                </span>
              </div>
              
              <p className="text-muted-foreground text-sm mb-2">/{workspace.workspaceSlug}</p>
              
              {workspace.description && (
                <p className="text-muted-foreground max-w-2xl">{workspace.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/dashboard/${slug}/projects/new`)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus size={18} />
            New Project
          </button>

          {isAdmin && (
            <Link href={`/dashboard/${slug}/settings`}>
              <button className="p-2 rounded-lg hover:bg-accent transition">
                <Settings size={20} className="text-muted-foreground" />
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FolderKanban className="text-blue-500" size={20} />
              </div>
              <TrendingUp className="text-muted-foreground" size={16} />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stats.totalProjects}</p>
            <p className="text-sm text-muted-foreground">Total Projects</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="text-green-500" size={20} />
              </div>
              <span className="text-sm text-muted-foreground">
                {stats.completionRate}%
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stats.completedTasks}</p>
            <p className="text-sm text-muted-foreground">Completed Tasks</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="text-orange-500" size={20} />
              </div>
              <AlertCircle className="text-orange-500" size={16} />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stats.overdueTasks}</p>
            <p className="text-sm text-muted-foreground">Overdue Tasks</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Users className="text-purple-500" size={20} />
              </div>
              <span className="text-sm text-muted-foreground">
                {workspace.maxMembers} max
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stats.totalMembers}</p>
            <p className="text-sm text-muted-foreground">Team Members</p>
          </motion.div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "projects", label: "Projects", icon: FolderKanban },
            { id: "members", label: "Members", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "overview" | "projects" | "members")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Recent Activity Placeholder */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Activity size={16} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">Activity item {i}</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workspace Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Owner</span>
                    <span className="text-sm text-foreground font-medium">
                      {workspace.owner.name || workspace.owner.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm text-foreground font-medium">
                      {format(new Date(workspace.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Visibility</span>
                    <span className="text-sm text-foreground font-medium">
                      {workspace.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Storage</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Used Storage</span>
                      <span className="text-sm text-foreground font-medium">
                        0 MB / {workspace.maxStorage} MB
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="text-center py-12 rounded-xl bg-card border border-border">
            <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first project to get started
            </p>
            <button
              onClick={() => router.push(`/dashboard/${slug}/projects/new`)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Create Project
            </button>
          </div>
        )}

        {activeTab === "members" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Invite Button */}
            {isAdmin && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
                >
                  <UserPlus size={18} />
                  Invite Member
                </button>
              </div>
            )}

            {/* Members List */}
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users size={20} />
                  Team Members ({members.length})
                </h3>
              </div>

              <div className="divide-y divide-border">
                {members.map((member) => {
                  const roleBadge = getRoleBadge(member.role);
                  const RoleIcon = roleBadge.icon;

                  return (
                    <div key={member.id} className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {member.user.image ? (
                          <Image
                            width={40}
                            height={40}
                            src={member.user.image}
                            alt={member.user.name || "User"}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                            {member.user.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            {member.user.name || "Anonymous"}
                            {member.role === "OWNER" && (
                              <Crown size={14} className="text-yellow-500" />
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">{member.user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {member.role !== "OWNER" && isAdmin ? (
                          <select
                            value={member.role}
                            onChange={(e) =>
                              handleUpdateRole(member.id, e.target.value as "ADMIN" | "MEMBER" | "GUEST")
                            }
                            disabled={updateMemberRole.isPending}
                            className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground focus:ring-2 ring-primary outline-none disabled:opacity-50"
                          >
                            <option value="ADMIN">Admin</option>
                            <option value="MEMBER">Member</option>
                            <option value="GUEST">Guest</option>
                          </select>
                        ) : (
                          <span
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${roleBadge.color}`}
                          >
                            <RoleIcon size={12} />
                            {roleBadge.label}
                          </span>
                        )}

                        {member.role !== "OWNER" && isAdmin && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={removeMember.isPending}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition disabled:opacity-50"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="bg-card rounded-xl border border-border w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Invite Team Member
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as "ADMIN" | "MEMBER" | "GUEST")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                  <option value="GUEST">Guest</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail || inviteMember.isPending}
                  className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {inviteMember.isPending ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Mail size={18} />
                  )}
                  Send Invitation
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-3 rounded-lg border border-border hover:bg-accent transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}