// types/calendar.types.ts
export interface CalendarDayAggregate {
  id: string;
  userId: string;
  date: string;
  totalTasks: number;
  dueTasks: number;
  criticalTasks: number;
  milestoneCount: number;
  plannedHours: number;
  actualHours: number;
  focusMinutes: number;
  workloadScore: number;
  overCapacity: boolean;
  hasPrimaryFocus: boolean;
  isReviewDay: boolean;
  updatedAt: string;
}

export interface CalendarInsights {
  totalPlannedHours: number;
  totalCapacityHours: number;
  commitmentGap: number;
  overloadedDays: number;
  focusDays: number;
  burnoutRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  timeAllocation: {
    deepWork: number;
    meetings: number;
    admin: number;
    learning: number;
  } | null; // ✅ Made nullable
}

export interface GoalCheckpoint {
  id: string;
  userId: string;
  workspaceId?: string;
  title: string;
  type: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'KPI';
  targetDate: string;
  completed: boolean;
  createdAt: string;
}

export interface SystemCalendarEvent {
  id: string;
  userId?: string;
  workspaceId?: string;
  title: string;
  type: 'WEEKLY_RESET' | 'MONTHLY_REVIEW' | 'SPRINT_END' | 'BILLING' | 'WORKSPACE_REVIEW';
  date: string;
  recurring: boolean;
  createdAt: string;
}

export interface BurnoutSignal {
  id: string;
  userId: string;
  weekStart: string;
  consecutiveHeavyDays: number;
  avgDailyLoad: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  createdAt: string;
}

export interface UserCapacity {
  id: string;
  userId: string;
  weeklyHours: number;
  dailyCapacityHours: number;
  deepWorkHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserWorkSchedule {
  id: string;
  userId: string;
  workDays: string[];
  workStartHour: number;
  workEndHour: number;
  timezone?: string;
}

export interface CreateGoalCheckpointInput {
  workspaceId?: string;
  title: string;
  type: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'KPI';
  targetDate: Date;
}

export interface CalendarFilters {
  workspaceId?: string;
  startDate: Date;
  endDate: Date;
}

export type BurnoutRisk = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';