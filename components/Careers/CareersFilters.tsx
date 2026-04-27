"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  JobDepartment,
  JobLocationType,
  JobType,
  DEPARTMENT_LABELS,
  LOCATION_LABELS,
  TYPE_LABELS,
} from "@/types/job.types";

export interface CareersFiltersState {
  search: string;
  department: JobDepartment | "";
  locationType: JobLocationType | "";
  type: JobType | "";
}

interface CareersFiltersProps {
  filters: CareersFiltersState;
  onChange: (f: CareersFiltersState) => void;
  totalCount: number;
}

const DEPT_OPTIONS = Object.entries(DEPARTMENT_LABELS) as [
  JobDepartment,
  string,
][];
const LOC_OPTIONS = Object.entries(LOCATION_LABELS) as [
  JobLocationType,
  string,
][];
const TYPE_OPTIONS = Object.entries(TYPE_LABELS) as [JobType, string][];

export const CareersFilters = ({
  filters,
  onChange,
  totalCount,
}: CareersFiltersProps) => {
  const hasFilters =
    filters.search !== "" ||
    filters.department !== "" ||
    filters.locationType !== "" ||
    filters.type !== "";

  const set = (key: keyof CareersFiltersState, value: string) =>
    onChange({ ...filters, [key]: value });

  const clearAll = () =>
    onChange({ search: "", department: "", locationType: "", type: "" });

  return (
    <div className="space-y-3">
      {/* Search + clear row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0 pointer-events-none"
            strokeWidth={1.8}
          />
          <input
            type="search"
            placeholder="Search roles, skills, or location…"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700 transition-colors"
          />
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5 shrink-0" />
            Clear
          </button>
        )}
      </div>

      {/* Filter selects */}
      <div className="flex flex-wrap gap-2">
        {/* Department */}
        <select
          value={filters.department}
          onChange={(e) => set("department", e.target.value)}
          className={cn(
            "rounded-lg border text-xs font-medium px-3 py-2 outline-none cursor-pointer transition-colors",
            filters.department
              ? "border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
              : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400",
          )}
        >
          <option value="">All Departments</option>
          {DEPT_OPTIONS.map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>

        {/* Location type */}
        <select
          value={filters.locationType}
          onChange={(e) => set("locationType", e.target.value)}
          className={cn(
            "rounded-lg border text-xs font-medium px-3 py-2 outline-none cursor-pointer transition-colors",
            filters.locationType
              ? "border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
              : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400",
          )}
        >
          <option value="">All Locations</option>
          {LOC_OPTIONS.map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>

        {/* Job type */}
        <select
          value={filters.type}
          onChange={(e) => set("type", e.target.value)}
          className={cn(
            "rounded-lg border text-xs font-medium px-3 py-2 outline-none cursor-pointer transition-colors",
            filters.type
              ? "border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
              : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400",
          )}
        >
          <option value="">All Types</option>
          {TYPE_OPTIONS.map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>

        {/* Result count */}
        <span className="ml-auto self-center text-xs text-neutral-400 dark:text-neutral-500 shrink-0">
          {totalCount} {totalCount === 1 ? "role" : "roles"}
        </span>
      </div>
    </div>
  );
};
