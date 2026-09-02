import { Button } from "@/components/ui/Button";
import { INTENT_OPTIONS } from "@/constants/intent.constants";

interface IntentSelectorProps {
  selectedIntent?:
    | "EXECUTION"
    | "PLANNING"
    | "REVIEW"
    | "LEARNING"
    | "COMMUNICATION";
  onIntentChange: (
    intent: "EXECUTION" | "PLANNING" | "REVIEW" | "LEARNING" | "COMMUNICATION",
  ) => void;
}

export function IntentSelector({
  selectedIntent,
  onIntentChange,
}: IntentSelectorProps) {
  return (
    <div>
      <span className="block text-sm font-medium text-foreground mb-2">
        Task Intent
      </span>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {INTENT_OPTIONS.map((intent) => {
          const Icon = intent.icon;
          const selected = selectedIntent === intent.value;

          return (
            <Button
              key={intent.value}
              type="button"
              variant="ghost"
              onClick={() => onIntentChange(intent.value)}
              className={`p-3 rounded-lg border text-left transition ${
                selected ? intent.activeClass : "border-border hover:bg-accent"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={16} />
                <span className="font-medium text-sm">{intent.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {intent.description}
              </p>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
