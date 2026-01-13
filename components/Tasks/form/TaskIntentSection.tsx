import { motion } from "framer-motion";
import {
  CheckCircle2,
  Zap,
  Lightbulb,
  Eye,
  BookOpen,
  MessageSquare,
} from "lucide-react";

// Intent options with icons and descriptions
const INTENT_OPTIONS = [
  {
    value: "EXECUTION",
    label: "Do Work",
    icon: Zap,
    description: "Active implementation and building",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500",
  },
  {
    value: "PLANNING",
    label: "Think & Plan",
    icon: Lightbulb,
    description: "Strategy and organization",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500",
  },
  {
    value: "REVIEW",
    label: "Review",
    icon: Eye,
    description: "Check and validate work",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500",
  },
  {
    value: "LEARNING",
    label: "Learn",
    icon: BookOpen,
    description: "Research and education",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500",
  },
  {
    value: "COMMUNICATION",
    label: "Communicate",
    icon: MessageSquare,
    description: "Meetings and discussions",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500",
  },
] as const;

type IntentType = typeof INTENT_OPTIONS[number]["value"];

interface TaskIntentSectionProps {
  selectedIntent: IntentType;
  onIntentChange: (intent: IntentType) => void;
}

export function TaskIntentSection({
  selectedIntent,
  onIntentChange,
}: TaskIntentSectionProps) {
  const selectedIntentOption = INTENT_OPTIONS.find(
    (opt) => opt.value === selectedIntent
  );

  return (
    <motion.div className="rounded-xl bg-card border border-border p-6 space-y-4">
      <div className="flex items-center gap-2">
        {selectedIntentOption && (
          <selectedIntentOption.icon
            className={selectedIntentOption.color}
            size={20}
          />
        )}
        <h3 className="text-lg font-semibold">Task Intent</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        What kind of work is this task?
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {INTENT_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedIntent === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onIntentChange(option.value)}
              className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                isSelected
                  ? `${option.bgColor} ${option.borderColor}`
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <Icon
                  size={24}
                  className={
                    isSelected ? option.color : "text-muted-foreground"
                  }
                />
                <span
                  className={`text-sm font-medium ${
                    isSelected ? option.color : "text-foreground"
                  }`}
                >
                  {option.label}
                </span>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 size={16} className={option.color} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Description of selected intent */}
      {selectedIntentOption && (
        <div
          className={`p-3 rounded-lg ${selectedIntentOption.bgColor} border ${selectedIntentOption.borderColor}`}
        >
          <p className={`text-sm ${selectedIntentOption.color}`}>
            <strong>{selectedIntentOption.label}:</strong>{" "}
            {selectedIntentOption.description}
          </p>
        </div>
      )}
    </motion.div>
  );
}