import type { ReactNode } from "react";
import { GettingStartedSection } from "./GettingStartedSection";
import { WorkspaceSection } from "./WorkspaceSection";
import { ProjectsSection } from "./ProjectSection";
import { TasksSection } from "./TaskSection";
import { AnnouncementsSection } from "./AnnouncementSection";
import { MembersSection } from "./MembersSection";
import { BillingSection, FocusSection, MeetingsSection, VotingSection } from "./MiscSection";
import { InviteMembersSection } from "./InviteMemberSection";
import { LabelsSection } from "./LabelsSection";
import { ActivitySection } from "./ActivitySection";

const SECTION_CONTENT_MAP: Record<string, ReactNode> = {
  "getting-started": <GettingStartedSection />,
  workspace: <WorkspaceSection />,
  projects: <ProjectsSection />,
  tasks: <TasksSection />,
  announcements: <AnnouncementsSection />,
  members: <MembersSection />,
  "invite-members": <InviteMembersSection />,
  labels: <LabelsSection />,
  activity: <ActivitySection />,
  focus: <FocusSection />,
  meetings: <MeetingsSection />,
  voting: <VotingSection />,
  billing: <BillingSection />,
};

export function useSectionContent(activeId: string): ReactNode {
  return SECTION_CONTENT_MAP[activeId] ?? null;
}