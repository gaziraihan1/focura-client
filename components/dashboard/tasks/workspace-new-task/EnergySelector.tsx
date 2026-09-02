import { Button } from "@/components/ui/Button";
import { ENERGY_OPTIONS } from "@/constants/intent.constants";

interface EnergySelectorProps {
  selectedEnergy?: "LOW" | "MEDIUM" | "HIGH";
  onEnergyChange: (energy: "LOW" | "MEDIUM" | "HIGH") => void;
}

export function EnergySelector({
  selectedEnergy,
  onEnergyChange,
}: EnergySelectorProps) {
  return (
    <div>
      <span className="block text-sm font-medium text-foreground mb-2">
        Ideal Energy
      </span>

      <div className="grid grid-cols-3 gap-3">
        {ENERGY_OPTIONS.map((energy) => {
          const selected = selectedEnergy === energy.value;

          return (
            <Button
              key={energy.value}
              type="button"
              variant="ghost"
              onClick={() => onEnergyChange(energy.value)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                selected
                  ? energy.className
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {energy.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
