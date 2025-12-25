import { Zap, Lightbulb, Eye, BookOpen, MessageSquare } from "lucide-react";

interface IntentBadgeProps {
  intent?: "EXECUTION" | "PLANNING" | "REVIEW" | "LEARNING" | "COMMUNICATION";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const INTENT_CONFIG = {
  EXECUTION: {
    label: "Do Work",
    icon: Zap,
    description: "Active implementation and building",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    dotColor: "bg-blue-500",
  },
  PLANNING: {
    label: "Think & Plan",
    icon: Lightbulb,
    description: "Strategy and organization",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    dotColor: "bg-purple-500",
  },
  REVIEW: {
    label: "Review",
    icon: Eye,
    description: "Check and validate work",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    dotColor: "bg-green-500",
  },
  LEARNING: {
    label: "Learn",
    icon: BookOpen,
    description: "Research and education",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    dotColor: "bg-amber-500",
  },
  COMMUNICATION: {
    label: "Communicate",
    icon: MessageSquare,
    description: "Meetings and discussions",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    dotColor: "bg-pink-500",
  },
} as const;

export function IntentBadge({ intent = "EXECUTION", size = "md", showLabel = true }: IntentBadgeProps) {
  const config = INTENT_CONFIG[intent];
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      container: "px-2 py-1 gap-1.5",
      icon: 12,
      text: "text-xs",
      dot: "w-1.5 h-1.5",
    },
    md: {
      container: "px-3 py-1.5 gap-2",
      icon: 14,
      text: "text-sm",
      dot: "w-2 h-2",
    },
    lg: {
      container: "px-4 py-2 gap-2",
      icon: 16,
      text: "text-base",
      dot: "w-2.5 h-2.5",
    },
  };

  const sizes = sizeClasses[size];

  if (!showLabel) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-lg ${config.bgColor} border ${config.borderColor} ${sizes.container}`}
        title={`${config.label}: ${config.description}`}
      >
        <Icon size={sizes.icon} className={config.color} />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-full ${config.bgColor} border ${config.borderColor} ${sizes.container}`}
    >
      <Icon size={sizes.icon} className={config.color} />
      <span className={`font-medium ${config.color} ${sizes.text}`}>
        {config.label}
      </span>
    </div>
  );
}

export function IntentCard({ intent = "EXECUTION" }: { intent?: IntentBadgeProps["intent"] }) {
  const config = INTENT_CONFIG[intent];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl ${config.bgColor} border ${config.borderColor} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
          <Icon size={20} className={config.color} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-semibold ${config.color}`}>
              {config.label}
            </span>
            <div className={`${config.dotColor} w-1.5 h-1.5 rounded-full`} />
          </div>
          <p className="text-sm text-muted-foreground">
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export { INTENT_CONFIG };