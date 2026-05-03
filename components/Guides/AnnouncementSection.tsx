import { InfoCard, SectionH, StepList, Warn } from "../ui";

const STEPS = [
  {
    title: "Go to Announcements",
    desc: "Find the Announcements section in your workspace navigation.",
  },
  {
    title: "Write your message",
    desc: "Use the rich-text editor to format your announcement. Add bold text, lists, and custom format tokens to highlight key information.",
  },
  {
    title: "Set visibility",
    desc: "Choose who should see this — the entire workspace, a specific project team, or a custom group.",
  },
  {
    title: "Pin if important",
    desc: "Toggle the pin option to keep critical announcements at the top of the feed until you choose to unpin them.",
  },
];

export function AnnouncementsSection() {
  return (
    <div>
      <InfoCard icon="◎" title="What are announcements?">
        Announcements let admins and owners broadcast important updates — policy changes, new
        features, upcoming events — to the workspace. They appear prominently so they&apos;re never
        missed.
      </InfoCard>

      <SectionH>Creating an announcement</SectionH>
      <StepList steps={STEPS} />

      <Warn>
        Only workspace Owners and Admins can create and pin announcements. Members can read but not
        edit or delete them.
      </Warn>

      <SectionH>Live preview</SectionH>
      <InfoCard icon="👁" title="See it before you send it">
        The announcement editor shows a live preview of your formatted message as you type, so you
        can confirm exactly how it will appear before publishing.
      </InfoCard>
    </div>
  );
}