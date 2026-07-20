import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskDetailsSection } from '@/components/Dashboard/WorkspaceNewTask/TaskDetailsSection';

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
  },
}));

vi.mock('@/components/Dashboard/WorkspaceNewTask/IntentSelector', () => ({
  IntentSelector: () => <div data-testid="intent-selector" />,
}));

vi.mock('@/components/Tasks/form/FocusEnergySection', () => ({
  FocusEnergySection: () => <div data-testid="focus-energy-section" />,
}));

vi.mock('@/components/Dashboard/WorkspaceNewTask/TaskDetailsSection/StatusDetailsSection', () => ({
  default: () => <div data-testid="status-section" />,
}));

vi.mock('@/components/Dashboard/WorkspaceNewTask/TaskDetailsSection/PriorityDetailsSection', () => ({
  default: () => <div data-testid="priority-section" />,
}));

const defaultProps = {
  status: 'TODO',
  priority: 'MEDIUM',
  intent: 'MAINTAIN',
  energyType: 'MEDIUM',
  focusRequired: false,
  focusLevel: null,
  distractionCost: null,
  startDate: '',
  dueDate: '',
  estimatedHours: undefined,
  errors: {} as any,
  onStatusChange: vi.fn(),
  onPriorityChange: vi.fn(),
  onIntentChange: vi.fn(),
  onEnergyTypeChange: vi.fn(),
  onFocusRequiredChange: vi.fn(),
  onFocusLevelChange: vi.fn(),
  onDistractionCostChange: vi.fn(),
  onStartDateChange: vi.fn(),
  onDueDateChange: vi.fn(),
  onEstimatedHoursChange: vi.fn(),
};

describe('TaskDetailsSection', () => {
  it('renders the Task Details heading', () => {
    render(<TaskDetailsSection {...defaultProps} />);
    expect(screen.getByText('Task Details')).toBeInTheDocument();
  });

  it('renders sub-sections', () => {
    render(<TaskDetailsSection {...defaultProps} />);
    expect(screen.getByTestId('status-section')).toBeInTheDocument();
    expect(screen.getByTestId('priority-section')).toBeInTheDocument();
    expect(screen.getByTestId('intent-selector')).toBeInTheDocument();
  });

  it('renders date inputs', () => {
    render(<TaskDetailsSection {...defaultProps} />);
    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
  });

  it('renders estimated hours input', () => {
    render(<TaskDetailsSection {...defaultProps} />);
    expect(screen.getByText('Estimated Hours')).toBeInTheDocument();
  });
});
