import { COLOR_MAP, MEMBER_ROLES } from "@/constants/guides.constants";
import { SectionH, StepList, Tip } from "../ui";

const STEPS = [
  {
    title: "Go to Settings → Members",
    desc: "Only Owners and Admins can access this page.",
  },
  {
    title: "Enter the email address",
    desc: "Type the email of the person you want to invite and select their role.",
  },
  {
    title: "Send the invite",
    desc: "They'll receive an email with a link to join your workspace. They'll need to create a Focura account if they don't have one.",
  },
];

export function MembersSection() {
  return (
    <div>
      <SectionH>Roles in Focura</SectionH>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {MEMBER_ROLES.map((role) => {
          const c = COLOR_MAP[role.color];
          return (
            <div key={role.name} className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-lg ${c.text}`}>{role.icon}</span>
                <span className={`text-sm font-semibold ${c.text}`}>{role.name}</span>
              </div>
              <ul className="space-y-1.5">
                {role.perms.map((perm) => (
                  <li key={perm} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className={`${c.text} text-[10px] mt-0.5 shrink-0`}>✓</span>
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <SectionH>Inviting members</SectionH>
      <StepList steps={STEPS} />

      <Tip>
        You can change a member&apos;s role at any time from the Members page, as long as you have
        Owner or Admin permissions.
      </Tip>
    </div>
  );
}