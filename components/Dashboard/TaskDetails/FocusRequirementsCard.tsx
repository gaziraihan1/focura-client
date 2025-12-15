// components/TaskDetails/FocusRequirementsCard.tsx
import { motion } from "framer-motion";
import { Brain, Zap, Shield, AlertCircle } from "lucide-react";
import { EnergyType } from "@/types/task.types";
import {
  getFocusLevelColor,
  getEnergyTypeColor,
} from "@/utils/task.utils";

interface FocusRequirementsCardProps {
  focusLevel?: number;
  energyType?: EnergyType;
  distractionCost?: number;
}

export const FocusRequirementsCard = ({
  focusLevel,
  energyType,
  distractionCost,
}: FocusRequirementsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-linear-to-r from-purple-500/10 to-blue-500/10 border-2 border-purple-500/20 p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="text-purple-500" size={24} />
        <h3 className="text-lg font-semibold">Focus Requirements</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Focus Level */}
        {focusLevel && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
            <Brain className={getFocusLevelColor(focusLevel)} size={20} />
            <div>
              <p className="text-xs text-muted-foreground">Focus Level</p>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-4 rounded-sm ${
                      level <= focusLevel
                        ? "bg-purple-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-bold">{focusLevel}/5</span>
              </div>
            </div>
          </div>
        )}

        {/* Energy Type */}
        {energyType && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
            <Zap className="text-yellow-500" size={20} />
            <div>
              <p className="text-xs text-muted-foreground">Energy Type</p>
              <div
                className={`mt-1 px-2 py-1 rounded-md inline-block text-xs font-semibold ${getEnergyTypeColor(
                  energyType
                )}`}
              >
                {energyType}
              </div>
            </div>
          </div>
        )}

        {/* Distraction Cost */}
        {distractionCost !== undefined && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
            <Shield className="text-blue-500" size={20} />
            <div>
              <p className="text-xs text-muted-foreground">Distraction Cost</p>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-4 rounded-sm ${
                      level <= distractionCost
                        ? "bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-bold">
                  {distractionCost}/5
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
        <p className="text-sm text-muted-foreground flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            This task requires focused attention. Consider finding a quiet
            environment and blocking distractions before starting.
          </span>
        </p>
      </div>
    </motion.div>
  );
};