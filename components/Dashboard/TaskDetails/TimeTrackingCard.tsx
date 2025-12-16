import { motion } from "framer-motion";
import { Timer, Hourglass, TrendingUp, AlertCircle, Clock } from "lucide-react";
import { TimeTracking } from "@/types/task.types";
import { formatTimeDuration, getTimeStatusColor } from "@/utils/task.utils";

interface TimeTrackingCardProps {
  timeTracking: TimeTracking;
  estimatedHours?: number | null;
}

export const TimeTrackingCard = ({
  timeTracking,
  estimatedHours,
}: TimeTrackingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 p-4 ${getTimeStatusColor(timeTracking)}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            <div>
              <p className="text-xs opacity-75">Time Elapsed</p>
              <p className="font-bold">
                {formatTimeDuration(timeTracking.hoursSinceCreation)}
              </p>
            </div>
          </div>

          {timeTracking.hoursUntilDue !== null && (
            <div className="flex items-center gap-2">
              <Hourglass className="w-5 h-5" />
              <div>
                <p className="text-xs opacity-75">Time Remaining</p>
                <p className="font-bold">
                  {formatTimeDuration(timeTracking.hoursUntilDue)}
                </p>
              </div>
            </div>
          )}

          {estimatedHours && timeTracking.timeProgress !== null && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <div>
                <p className="text-xs opacity-75">Progress</p>
                <p className="font-bold">{timeTracking.timeProgress}%</p>
              </div>
            </div>
          )}
        </div>

        {estimatedHours && timeTracking.timeProgress !== null && (
          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="w-full h-3 bg-background/50 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  timeTracking.timeProgress > 100
                    ? "bg-red-600"
                    : timeTracking.timeProgress > 80
                    ? "bg-orange-500"
                    : "bg-current"
                }`}
                style={{
                  width: `${Math.min(100, timeTracking.timeProgress)}%`,
                }}
              />
            </div>
            <p className="text-xs mt-1 opacity-75">
              {timeTracking.hoursSinceCreation}h / {estimatedHours}h estimated
            </p>
          </div>
        )}

        {timeTracking.isOverdue && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Overdue</span>
          </div>
        )}

        {timeTracking.isDueToday && !timeTracking.isOverdue && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Due Today</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};