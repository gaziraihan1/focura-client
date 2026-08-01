"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  Brain,
  Save,
  Loader2,
  Globe,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useUserCapacity, useUserSchedule } from "@/hooks/useUserSettings";

// ─── Constants ──────────────────────────────────────────────────────────────

const DAYS = [
  { value: "MON", label: "Mon" },
  { value: "TUE", label: "Tue" },
  { value: "WED", label: "Wed" },
  { value: "THU", label: "Thu" },
  { value: "FRI", label: "Fri" },
  { value: "SAT", label: "Sat" },
  { value: "SUN", label: "Sun" },
] as const;

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Sydney",
  "Pacific/Auckland",
] as const;

type SaveStatus = "idle" | "saving" | "success" | "error";

// ─── Component ──────────────────────────────────────────────────────────────

export function CapacityScheduleForm() {
  const {
    data: capacity,
    loading: capLoading,
    error: capError,
    updateCapacity,
  } = useUserCapacity();
  const {
    data: schedule,
    loading: schedLoading,
    error: schedError,
    updateSchedule,
  } = useUserSchedule();

  const [dailyHours, setDailyHours] = useState(8);
  const [weeklyHours, setWeeklyHours] = useState(40);
  const [deepWorkHours, setDeepWorkHours] = useState(4);
  const [workDays, setWorkDays] = useState<string[]>([
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
  ]);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);
  const [timezone, setTimezone] = useState("UTC");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // Populate from fetched data
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
      if (schedule.timezone) setTimezone(schedule.timezone);
    }
  }, [schedule]);

  const toggleDay = (day: string) => {
    setWorkDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const capOk = await updateCapacity({
        dailyCapacityHours: dailyHours,
        weeklyHours,
        deepWorkHours,
      });
      const schedOk = await updateSchedule({
        workDays,
        workStartHour: startHour,
        workEndHour: endHour,
        timezone,
      });
      setSaveStatus(capOk && schedOk ? "success" : "error");
    } catch {
      setSaveStatus("error");
    }
  };

  // Clear success/error after 3s
  useEffect(() => {
    if (saveStatus === "success" || saveStatus === "error") {
      const timer = setTimeout(() => setSaveStatus("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (capLoading || schedLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (capError || schedError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
        <p className="text-sm text-muted-foreground">
          {capError || schedError || "Failed to load settings. Please try again."}
        </p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Capacity &amp; Schedule
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your work hours, daily capacity, and schedule. These values
          power workload calculations, burnout detection, and calendar insights.
        </p>
      </div>

      {/* ── Daily Capacity ───────────────────────────────────────────────── */}
      <SectionCard
        icon={<Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
        iconBg="bg-blue-500/10"
        title="Daily Capacity"
        description="How many hours you can realistically work per day"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <SliderField
            label="Daily Capacity (hours)"
            value={dailyHours}
            min={1}
            max={16}
            onChange={setDailyHours}
            suffix="h / day"
          />
          <SliderField
            label="Weekly Target (hours)"
            value={weeklyHours}
            min={1}
            max={80}
            onChange={setWeeklyHours}
            suffix="h / week"
          />
          <SliderField
            label="Deep Work Goal (hours/day)"
            value={deepWorkHours}
            min={0}
            max={12}
            onChange={setDeepWorkHours}
            suffix="h / day"
          />
        </div>
      </SectionCard>

      {/* ── Work Schedule ────────────────────────────────────────────────── */}
      <SectionCard
        icon={
          <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        }
        iconBg="bg-purple-500/10"
        title="Work Schedule"
        description="Your typical working days and hours"
      >
        <div className="space-y-6">
          {/* Working Days */}
          <fieldset>
            <legend className="mb-3 text-xs font-medium text-muted-foreground">
              Working Days
            </legend>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const selected = workDays.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    aria-pressed={selected}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-secondary text-secondary-foreground hover:border-primary/40 hover:bg-secondary/80"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Start / End Hours */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Work Start Hour"
              value={startHour}
              onChange={setStartHour}
              options={HOUR_OPTIONS}
              formatOption={(h) => `${String(h).padStart(2, "0")}:00`}
            />
            <SelectField
              label="Work End Hour"
              value={endHour}
              onChange={setEndHour}
              options={HOUR_OPTIONS}
              formatOption={(h) => `${String(h).padStart(2, "0")}:00`}
            />
          </div>

          {/* Timezone */}
          <SelectField
            label="Timezone"
            value={timezone}
            onChange={setTimezone}
            options={TIMEZONES as unknown as number[]}
            formatOption={(tz) => String(tz).replace(/_/g, " ")}
            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      </SectionCard>

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <SectionCard
        icon={<Brain className="h-5 w-5 text-green-600 dark:text-green-400" />}
        iconBg="bg-green-500/10"
        title="About These Settings"
        description="How your capacity and schedule affect Focura"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          Your daily capacity sets the baseline for workload scoring. When
          planned hours exceed capacity, the calendar flags you as{" "}
          <strong className="text-foreground">over-capacity</strong>. The weekly
          target and deep work goal refine burnout risk calculations so Focura
          can suggest breaks and lighter days when you need them most.
        </p>
      </SectionCard>

      {/* ── Save / Status ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
        {/* Status message */}
        <div className="flex-1">
          {saveStatus === "success" && (
            <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Settings saved successfully
            </p>
          )}
          {saveStatus === "error" && (
            <p className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              Failed to save settings. Please try again.
            </p>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saveStatus === "saving" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saveStatus === "saving" ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

interface SectionCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SectionCard({
  icon,
  iconBg,
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  suffix: string;
}

function SliderField({
  label,
  value,
  min,
  max,
  onChange,
  suffix,
}: SliderFieldProps) {
  const id = `slider-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-medium text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
      />
      <span className="text-sm font-semibold text-foreground">
        {value}
        {suffix}
      </span>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: number | string;
  onChange: (v: any) => void;
  options: number[] | readonly string[];
  formatOption: (v: any) => string;
  icon?: React.ReactNode;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  formatOption,
  icon,
}: SelectFieldProps) {
  const id = `select-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
      >
        {icon}
        {label}
      </label>
      <select
        id={id}
        value={String(value)}
        onChange={(e) => onChange(
          options.some((o) => typeof o === "number")
            ? Number(e.target.value)
            : e.target.value
        )}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {options.map((opt) => (
          <option key={String(opt)} value={String(opt)}>
            {formatOption(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}
