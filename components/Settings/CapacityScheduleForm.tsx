'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar, Brain, Save, Loader2 } from 'lucide-react';
import { useUserCapacity, useUserSchedule } from '@/hooks/useUserSettings';

const DAYS = [
  { value: 'MON', label: 'Mon' },
  { value: 'TUE', label: 'Tue' },
  { value: 'WED', label: 'Wed' },
  { value: 'THU', label: 'Thu' },
  { value: 'FRI', label: 'Fri' },
  { value: 'SAT', label: 'Sat' },
  { value: 'SUN', label: 'Sun' },
];

export function CapacityScheduleForm() {
  const { data: capacity, loading: capLoading, updateCapacity } = useUserCapacity();
  const { data: schedule, loading: schedLoading, updateSchedule } = useUserSchedule();

  const [dailyHours, setDailyHours] = useState(8);
  const [weeklyHours, setWeeklyHours] = useState(40);
  const [deepWorkHours, setDeepWorkHours] = useState(4);
  const [workDays, setWorkDays] = useState<string[]>(['MON', 'TUE', 'WED', 'THU', 'FRI']);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (capacity) {
      setDailyHours(capacity.dailyCapacityHours);
      setWeeklyHours(capacity.weeklyHours);
      setDeepWorkHours(capacity.deepWorkHours);
    }
  }, [capacity]);

  useEffect(() => {
    if (schedule) {
      setWorkDays(schedule.workDays);
      setStartHour(schedule.workStartHour);
      setEndHour(schedule.workEndHour);
    }
  }, [schedule]);

  const toggleDay = (day: string) => {
    setWorkDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCapacity({
        dailyCapacityHours: dailyHours,
        weeklyHours,
        deepWorkHours,
      });
      await updateSchedule({
        workDays,
        workStartHour: startHour,
        workEndHour: endHour,
      });
    } finally {
      setSaving(false);
    }
  };

  if (capLoading || schedLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="space-y-8">
      {/* Daily Capacity */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Daily Capacity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              How many hours you can realistically work per day
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Daily Capacity (hours)
            </label>
            <input
              type="range"
              min={1}
              max={16}
              value={dailyHours}
              onChange={e => setDailyHours(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <span className="text-sm font-semibold">{dailyHours}h / day</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Weekly Target (hours)
            </label>
            <input
              type="range"
              min={1}
              max={80}
              value={weeklyHours}
              onChange={e => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <span className="text-sm font-semibold">{weeklyHours}h / week</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Deep Work Goal (hours/day)
            </label>
            <input
              type="range"
              min={0}
              max={12}
              value={deepWorkHours}
              onChange={e => setDeepWorkHours(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <span className="text-sm font-semibold">{deepWorkHours}h / day</span>
          </div>
        </div>
      </div>

      {/* Work Schedule */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Work Schedule</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your typical working days and hours
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-3">
              Working Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button
                  key={day.value}
                  onClick={() => toggleDay(day.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    workDays.includes(day.value)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-secondary-foreground border-border hover:border-primary/30'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Work Start Hour
              </label>
              <select
                value={startHour}
                onChange={e => setStartHour(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {hourOptions.map(h => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Work End Hour
              </label>
              <select
                value={endHour}
                onChange={e => setEndHour(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {hourOptions.map(h => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Energy Insight */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
            <Brain className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">About These Settings</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your capacity and schedule affect workload calculations, burnout detection, and calendar insights
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-6">
          These values are used to compute your daily workload score (planned hours / capacity),
          detect when you&apos;re over capacity, and calculate burnout risk. Update them to match your
          actual working patterns for the most accurate insights.
        </p>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
