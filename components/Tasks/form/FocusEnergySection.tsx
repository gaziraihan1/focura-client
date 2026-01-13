import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface FocusEnergySectionProps {
  focusRequired: boolean;
  focusLevel: number;
  energyType: "LOW" | "MEDIUM" | "HIGH";
  distractionCost: number;
  onFocusRequiredChange: (focusRequired: boolean) => void;
  onFocusLevelChange: (focusLevel: number) => void;
  onEnergyTypeChange: (energyType: "LOW" | "MEDIUM" | "HIGH") => void;
  onDistractionCostChange: (distractionCost: number) => void;
}

export function FocusEnergySection({
  focusRequired,
  focusLevel,
  energyType,
  distractionCost,
  onFocusRequiredChange,
  onFocusLevelChange,
  onEnergyTypeChange,
  onDistractionCostChange,
}: FocusEnergySectionProps) {
  return (
    <motion.div className="rounded-xl bg-card border border-border p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Brain className="text-primary" />
        <h3 className="text-lg font-semibold">Focus & Energy</h3>
      </div>

      <label className="flex items-center justify-between">
        <span className="text-sm">Requires deep focus</span>
        <input
          type="checkbox"
          checked={focusRequired}
          onChange={(e) => onFocusRequiredChange(e.target.checked)}
          className="accent-primary"
        />
      </label>

      {focusRequired && (
        <>
          <div>
            <label className="text-sm mb-2 block">Focus Level (1–5)</label>
            <input
              type="range"
              min={1}
              max={5}
              value={focusLevel}
              onChange={(e) => onFocusLevelChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Light</span>
              <span className="font-medium">{focusLevel}</span>
              <span>Deep</span>
            </div>
          </div>

          <div>
            <label className="text-sm mb-2 block">Energy Required</label>
            <div className="grid grid-cols-3 gap-2">
              {(["LOW", "MEDIUM", "HIGH"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => onEnergyTypeChange(level)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    energyType === level
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm mb-2 block">Distraction Cost</label>
            <input
              type="number"
              min={0}
              max={5}
              value={distractionCost}
              onChange={(e) => onDistractionCostChange(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-border"
            />
            <p className="text-xs text-muted-foreground mt-1">
              How much does interruption cost? (0-5)
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}