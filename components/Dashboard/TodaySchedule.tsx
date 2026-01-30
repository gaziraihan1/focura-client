import { UpcomingEvent } from "@/types/dashboard";
import { Calendar } from "lucide-react";


interface TodayScheduleProps {
  events: UpcomingEvent[];
}

export function TodaySchedule({ events }: TodayScheduleProps) {
  return (
    <div className="bg-card border rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6">Today&apos;s Schedule</h2>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 border rounded-lg">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-primary" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.time}</p>
              </div>

              <EventBadge type={event.type} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventBadge({ type }: { type: UpcomingEvent["type"] }) {
  const styles =
    type === "Meeting"
      ? "bg-blue-500/10 text-blue-500"
      : "bg-red-500/10 text-red-500";

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles}`}>
      {type}
    </span>
  );
}
