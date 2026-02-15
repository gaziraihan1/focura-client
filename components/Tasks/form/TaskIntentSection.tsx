import { INTENT_OPTIONS } from "@/constant/intent.constant";
import { motion } from "framer-motion";
import {
  CheckCircle2,
} from "lucide-react";

// Intent options with icons and descriptions


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
  const textStyle = selectedIntentOption?.activeClass.split(" ")[2]

  return (
    <motion.div className="rounded-xl bg-card border border-border p-6 space-y-4">
      <div className="flex items-center gap-2">
        {selectedIntentOption && (
          <selectedIntentOption.icon
            className={selectedIntentOption.activeClass}
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

          const textStyle = option.activeClass.split(" ")[2];

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onIntentChange(option.value)}
              className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                isSelected
                  ? `${option.activeClass}`
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <Icon
                  size={24}
                  className={`
                    ${textStyle}
                  "text-muted-foreground"
                  `}
                />
                <span
                  className='text-sm font-medium text-foreground'
                >
                  {option.label}
                </span>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 size={16} className={textStyle} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Description of selected intent */}
      {selectedIntentOption && (
        <div
          className={`p-3 rounded-lg ${selectedIntentOption.activeClass} border`}
        >
          <p className={`text-sm ${textStyle}`}>
            <strong>{selectedIntentOption.label}:</strong>{" "}
            {selectedIntentOption.description}
          </p>
        </div>
      )}
    </motion.div>
  );
}