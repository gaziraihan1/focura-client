// tests/mocks/handlers/index.ts
import { adminHandlers } from "./handlers/admin.handlers";
import { analyticsHandlers } from "./handlers/analytics.handlers";
import { featureHandlers } from "./handlers/feature.handlers";
import { meetingHandlers } from "./handlers/meeting.handlers";
import { projectHandlers } from "./handlers/project.handlers";
import { subtaskHandlers } from "./handlers/subtask.handlers";
import { taskHandlers } from "./handlers/task.handlers";
import { userHandler } from "./handlers/user.handler";
import { workspaceHandlers } from "./handlers/workspace.handlers";
import { dailyTaskHandlers } from "./handlers/dailyTask.handlers";
import { calendarHandlers } from "./handlers/calendar.handlers";
import { activityHandlers } from "./handlers/activity.handlers";
import { labelHandlers } from "./handlers/label.handlers";
import { storageHandlers } from "./handlers/storage.handlers";
import { focusSessionHandlers } from "./handlers/focusSession.handlers";
import { billingHandlers } from "./handlers/billing.handlers";
import { contactHandlers } from "./handlers/contact.handlers";

export const handlers = [
  ...workspaceHandlers,
  ...taskHandlers,
  ...meetingHandlers,
  ...projectHandlers,
  ...subtaskHandlers,
  ...userHandler,
  ...analyticsHandlers,
  ...featureHandlers,
  ...adminHandlers,
  ...dailyTaskHandlers,
  ...calendarHandlers,
  ...activityHandlers,
  ...labelHandlers,
  ...storageHandlers,
  ...focusSessionHandlers,
  ...billingHandlers,
  ...contactHandlers,
];
