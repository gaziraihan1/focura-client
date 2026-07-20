import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CreateTaskModal from '@/components/Dashboard/ProjectDetails/CreateTaskModal';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    X: icon('x'),
    Loader2: icon('loader2'),
    Zap: icon('zap'),
    Dumbbell: icon('dumbbell'),
    Brain: icon('brain'),
    BatteryFull: icon('battery-full'),
    BatteryMedium: icon('battery-medium'),
    BatteryLow: icon('battery-low'),
  };
});

vi.mock('@/hooks/useProjects', () => ({
  useProjectRoleCheck: vi.fn(() => ({ isManagerOrAdmin: true })),
}));

vi.mock('@/components/Labels/LabelPicker', () => ({
  LabelPicker: () => <div data-testid="label-picker" />,
}));

vi.mock('@/components/Tasks/form/FocusEnergySection', () => ({
  FocusEnergySection: () => <div data-testid="focus-energy" />,
}));

vi.mock('@/hooks/useCreateTaskModal', () => ({
  useCreateTaskModal: vi.fn(() => ({
    formData: {
      title: '', description: '', intent: '', focusRequired: false,
      focusLevel: '', energyType: '', distractionCost: '',
      estimatedHours: '', priority: '', startDate: '', dueDate: '',
      labelIds: [], assigneeIds: [],
    },
    errors: {},
    isSubmitting: false,
    updateField: vi.fn(),
    toggleAssignee: vi.fn(),
    handleSubmit: vi.fn(),
  })),
}));

vi.mock('@/components/Dashboard/ProjectDetails/TaskModal/TaskTitleInput', () => ({ TaskTitleInput: () => <div data-testid="title-input" /> }));
vi.mock('@/components/Dashboard/ProjectDetails/TaskModal/TaskDescriptionInput', () => ({ TaskDescriptionInput: () => <div data-testid="desc-input" /> }));
vi.mock('@/components/Dashboard/ProjectDetails/TaskModal/TaskIntentPicker', () => ({ TaskIntentPicker: () => <div data-testid="intent-picker" /> }));
vi.mock('@/components/Dashboard/ProjectDetails/TaskModal/TaskPriorityPicker', () => ({ TaskPriorityPicker: () => <div data-testid="priority-picker" /> }));
vi.mock('@/components/Dashboard/ProjectDetails/TaskModal/TaskDueDateInput', () => ({ TaskDueDateInput: () => <div data-testid="due-date" /> }));
vi.mock('@/components/Dashboard/ProjectDetails/TaskModal/TaskEstimatedHoursInput', () => ({ TaskEstimatedHoursInput: () => <div data-testid="est-hours" /> }));
vi.mock('@/components/Dashboard/ProjectDetails/TaskModal/TaskAssigneePicker', () => ({ TaskAssigneePicker: () => <div data-testid="assignee-picker" /> }));
vi.mock('@/components/Dashboard/ProjectDetails/TaskModal/TaskStartDateInput', () => ({ TaskStartDateInput: () => <div data-testid="start-date" /> }));

describe('CreateTaskModal', () => {
  const defaultProps = {
    projectId: 'p-1',
    workspaceId: 'ws-1',
    projectMembers: [],
    onClose: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders the modal heading', () => {
    render(<CreateTaskModal {...defaultProps} />);
    expect(screen.getByText('Create Project Task')).toBeInTheDocument();
  });

  it('renders the Create Task button', () => {
    render(<CreateTaskModal {...defaultProps} />);
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('renders Cancel button', () => {
    render(<CreateTaskModal {...defaultProps} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});
