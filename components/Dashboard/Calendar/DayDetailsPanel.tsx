// components/Calendar/DayDetailsPanel.tsx
import { useState } from 'react';
import { X, Brain, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import type { CalendarDayAggregate, GoalCheckpoint, SystemCalendarEvent } from '@/types/calendar.types';
import { useEnergyLevel, useEnergyHistory } from '@/hooks/useEnergyLevel';
import {
  PlannedHoursCard,
  FocusSessionsCard,
  GoalsCard,
  BurnoutCard,
  EventsCard,
  DaySummaryBar,
} from './DayDetailsPanelParts';

interface DayDetailsPanelProps {
  date: Date;
  aggregate?: CalendarDayAggregate;
  goals: GoalCheckpoint[];
  events: SystemCalendarEvent[];
  onClose: () => void;
}

function EnergyLevelSection({ date }: { date: Date }) {
  const { data: energy, logEnergy, refetch } = useEnergyLevel(date);
  const [showSlider, setShowSlider] = useState(false);
  const [value, setValue] = useState(energy?.energyLevel ?? 5);
  const [note, setNote] = useState('');

  const handleLog = async () => {
    const ok = await logEnergy({ date, energyLevel: value, note: note || undefined });
    if (ok) {
      setShowSlider(false);
      setNote('');
      refetch();
    }
  };

  return (
    <div className="p-4 rounded-xl border border-border bg-background">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-green-500/10">
          <Brain className="w-4 h-4 text-green-600 dark:text-green-400" />
        </div>
        <h4 className="text-sm font-medium text-muted-foreground">Energy Level</h4>
      </div>

      {energy ? (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{energy.energyLevel}</span>
            <span className="text-sm text-muted-foreground">/ 10</span>
          </div>
          {energy.note && (
            <p className="text-xs text-muted-foreground mt-1 italic">{energy.note}</p>
          )}
          <button
            onClick={() => { setValue(energy.energyLevel); setShowSlider(!showSlider); }}
            className="mt-2 text-xs text-primary hover:underline"
          >
            {showSlider ? 'Cancel' : 'Update'}
          </button>
        </div>
      ) : (
        <div>
          {!showSlider ? (
            <button
              onClick={() => setShowSlider(true)}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              + Log your energy level
            </button>
          ) : null}
        </div>
      )}

      {showSlider && (
        <div className="mt-3 space-y-3">
          <div>
            <input
              type="range"
              min={1}
              max={10}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Low</span>
              <span className="font-semibold text-foreground">{value}/10</span>
              <span>High</span>
            </div>
          </div>
          <input
            type="text"
            placeholder="How are you feeling? (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
            maxLength={500}
          />
          <button
            onClick={handleLog}
            className="w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

function EnergyHistorySection({ date }: { date: Date }) {
  const rangeStart = new Date(date);
  rangeStart.setDate(rangeStart.getDate() - 90);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data: history, pagination, loading } = useEnergyHistory(rangeStart, date, page, limit);

  const getBarColor = (level: number): string => {
    if (level >= 8) return 'bg-green-500';
    if (level >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-4 rounded-xl border border-border bg-background">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-green-500/10">
            <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="text-sm font-medium text-muted-foreground">Energy History</h4>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4 text-center">No energy data yet</p>
      ) : (
        <>
          <div className="space-y-1.5">
            {history.map((entry) => {
              const d = new Date(entry.date);
              const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <div key={entry.id} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-12 shrink-0">{label}</span>
                  <div className="flex-1 h-4 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getBarColor(entry.energyLevel)}`}
                      style={{ width: `${entry.energyLevel * 10}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-6 text-right">{entry.energyLevel}</span>
                </div>
              );
            })}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="p-1 rounded-md hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} entries)
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="p-1 rounded-md hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function DayDetailsPanel({
  date,
  aggregate,
  goals,
  events,
  onClose,
}: DayDetailsPanelProps) {
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="border-t border-border bg-card">
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">{formattedDate}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Day overview and insights
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Energy Level */}
          <EnergyLevelSection date={date} />

          {/* Planned Hours */}
          <PlannedHoursCard aggregate={aggregate} />

          {/* Focus Sessions */}
          <FocusSessionsCard aggregate={aggregate} />

          {/* Goals */}
          <GoalsCard goals={goals} />

          {/* Burnout Level */}
          <BurnoutCard aggregate={aggregate} />

          {/* Events */}
          <EventsCard events={events} isReviewDay={aggregate?.isReviewDay} />
        </div>

        {/* Energy History */}
        <div className="mt-4">
          <EnergyHistorySection date={date} />
        </div>

        {/* Additional Info Bar */}
        <div className="mt-4">
          <DaySummaryBar aggregate={aggregate} />
        </div>
      </div>
    </div>
  );
}
