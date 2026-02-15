// types/calendar-page.types.ts
import type { CalendarDayAggregate } from '@/types/calendar.types';

export interface CalendarFilters {
  workspaceId?: string;
  startDate: Date;
  endDate: Date;
}



export type BurnoutRisk = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'NONE';

export interface GoalCheckpoint {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
}

export interface CalendarDayData {
  date: Date;
  aggregate?: CalendarDayAggregate;
  goals: GoalCheckpoint[];
  isToday: boolean;
  isCurrentMonth: boolean;
  workloadColor: string;
}