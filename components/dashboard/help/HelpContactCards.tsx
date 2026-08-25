"use client";

import { Mail, MessageCircle, Bug, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContactOption } from "@/types/help.types";

const CONTACT_OPTIONS: ContactOption[] = [
  {
    id: "email",
    icon: "mail",
    title: "Email support",
    description: "For billing, account issues, and non-urgent bugs. Replies within 24 h.",
    cta: "Send email ↗",
    href: "mailto:focurabusiness@gmail.com",
  },
  {
    id: "chat",
    icon: "chat",
    title: "Live chat",
    description: "Talk to a human Mon–Fri, 9 am–6 pm UTC. Avg wait under 3 min.",
    cta: "Open chat",
  },
  {
    id: "bug",
    icon: "bug",
    title: "Bug report",
    description: "Found a bug? Submit a detailed report and we'll triage it within 48 h.",
    cta: "Report bug",
  },
  {
    id: "feature",
    icon: "sparkles",
    title: "Feature request",
    description: "Vote on existing ideas or submit a new one to our public roadmap.",
    cta: "View roadmap ↗",
    href: "http://localhost:3000/roadmap",
  },
];

const IconMap: Record<string, React.FC<{ size?: number; strokeWidth?: number }>> = {
  mail: Mail,
  chat: MessageCircle,
  bug: Bug,
  sparkles: Sparkles,
};

interface HelpContactCardsProps {
  className?: string;
  onChatOpen?: () => void;
  onBugReport?: () => void;
}

export function HelpContactCards({
  className,
  onChatOpen,
  onBugReport,
}: HelpContactCardsProps) {
  const handleAction = (option: ContactOption) => {
    if (option.href) {
      window.open(option.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (option.id === "chat") onChatOpen?.();
    if (option.id === "bug") onBugReport?.();
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1",
        className,
      )}
    >
      {CONTACT_OPTIONS.map((option) => {
        const Icon = IconMap[option.icon];
        return (
          <button
            key={option.id}
            onClick={() => handleAction(option)}
            className={cn(
              "group flex flex-col items-start gap-2 rounded-xl border border-border",
              "bg-card p-4 text-left",
              "transition-all duration-150 outline-none",
              "hover:border-ring/40 hover:bg-secondary/50",
              "focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md",
                "bg-secondary border border-border",
                "transition-colors duration-150 group-hover:bg-background",
              )}
            >
              {Icon && (
                <Icon
                  size={15}
                  strokeWidth={1.75}
                />
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-0.5">
                {option.title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {option.description}
              </p>
            </div>

            <span className="text-xs text-muted-foreground font-mono mt-auto pt-1 group-hover:text-foreground transition-colors">
              {option.cta}
            </span>
          </button>
        );
      })}
    </div>
  );
}