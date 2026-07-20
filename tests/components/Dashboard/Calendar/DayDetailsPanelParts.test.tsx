import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  PlannedHoursCard,
  GoalsCard,
  BurnoutCard,
  getBurnoutColor,
  getBurnoutLabel,
} from '@/components/Dashboard/Calendar/DayDetailsPanelParts';

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`${name}-icon`} {...props} />;
    Component.displayName = name;
    return Component;
  };
  return {
    Clock: icon('Clock'),
    Zap: icon('Zap'),
    Target: icon('Target'),
    Flame: icon('Flame'),
    Calendar: icon('Calendar'),
    CheckCircle2: icon('CheckCircle2'),
  };
});

describe('getBurnoutColor / getBurnoutLabel', () => {
  it('returns red for critical score', () => {
    expect(getBurnoutColor(2.0)).toContain('text-red-600');
    expect(getBurnoutLabel(2.0)).toBe('Critical');
  });

  it('returns green for low risk score', () => {
    expect(getBurnoutColor(0.5)).toContain('text-green-600');
    expect(getBurnoutLabel(0.5)).toBe('Low Risk');
  });
});

describe('PlannedHoursCard', () => {
  it('shows "No tasks scheduled" when no aggregate', () => {
    render(<PlannedHoursCard />);
    expect(screen.getByText('No tasks scheduled')).toBeInTheDocument();
  });

  it('renders planned hours when aggregate provided', () => {
    const aggregate = {
      id: '1',
      userId: 'u1',
      date: '2026-01-01',
      totalTasks: 3,
      dueTasks: 1,
      criticalTasks: 0,
      milestoneCount: 0,
      plannedHours: 8.5,
      actualHours: 6.2,
      focusMinutes: 120,
      workloadScore: 0.8,
      overCapacity: false,
      hasPrimaryFocus: true,
      isReviewDay: false,
      updatedAt: '',
    };
    render(<PlannedHoursCard aggregate={aggregate} />);
    expect(screen.getByText('8.5h')).toBeInTheDocument();
    expect(screen.getByText('6.2h actual')).toBeInTheDocument();
    expect(screen.getByText('3 tasks scheduled')).toBeInTheDocument();
  });
});

describe('GoalsCard', () => {
  it('shows "No goals set" for empty list', () => {
    render(<GoalsCard goals={[]} />);
    expect(screen.getByText('No goals set')).toBeInTheDocument();
  });

  it('renders goal titles', () => {
    const goals = [
      { id: 'g1', userId: 'u1', title: 'Ship v2', type: 'WEEKLY', targetDate: '', completed: false, createdAt: '' },
      { id: 'g2', userId: 'u1', title: 'Review docs', type: 'MONTHLY', targetDate: '', completed: true, createdAt: '' },
    ];
    render(<GoalsCard goals={goals} />);
    expect(screen.getByText('Ship v2')).toBeInTheDocument();
    expect(screen.getByText('Review docs')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

describe('BurnoutCard', () => {
  it('shows "No data" without aggregate', () => {
    render(<BurnoutCard />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders burnout label and over-capacity warning', () => {
    const aggregate = {
      id: '1',
      userId: 'u1',
      date: '2026-01-01',
      totalTasks: 5,
      dueTasks: 3,
      criticalTasks: 2,
      milestoneCount: 0,
      plannedHours: 10,
      actualHours: 12,
      focusMinutes: 60,
      workloadScore: 1.6,
      overCapacity: true,
      hasPrimaryFocus: false,
      isReviewDay: false,
      updatedAt: '',
    };
    render(<BurnoutCard aggregate={aggregate} />);
    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('⚠ Over capacity')).toBeInTheDocument();
    expect(screen.getByText('2 critical tasks')).toBeInTheDocument();
  });
});
