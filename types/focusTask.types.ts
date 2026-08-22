import { Task } from '@/hooks/useTask';

export interface FocusTaskCardProps {
  task: Task;
  /** Omit to subscribe to the shared focus countdown */
  timeRemaining?: number; // seconds
}

