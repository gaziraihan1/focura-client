import { ENERGY_OPTIONS } from "@/constant/intent.constant";

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
      <label className="block text-sm font-medium text-foreground mb-2">
        Ideal Energy
      </label>

      <div className="grid grid-cols-3 gap-3">
        {ENERGY_OPTIONS.map((energy) => {
          const selected = selectedEnergy === energy.value;

          return (
            <button
              key={energy.value}
              type="button"
              onClick={() => onEnergyChange(energy.value)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                selected
                  ? energy.className
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {energy.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}