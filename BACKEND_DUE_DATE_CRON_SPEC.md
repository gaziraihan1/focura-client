# Backend Due Date Reminder Cron Job — Implementation Specification

## Overview

This document specifies the backend cron job(s) needed to send task due date reminder notifications. The frontend already supports `TASK_DUE_SOON`, `TASK_OVERDUE`, and `DEADLINE_REMINDER` notification types.

## Notification Types

| Type | When to Send | Example Message |
|------|-------------|-----------------|
| `TASK_DUE_SOON` | Task due within user's configured hours (e.g., 3h, 6h) | "Task 'Deploy feature' is due in 3 hours" |
| `TASK_OVERDUE` | Task past due date and status is NOT `COMPLETED`/`CANCELLED` | "Task 'Deploy feature' is overdue" |
| `DEADLINE_REMINDER` | Generic reminder at configurable intervals | "Reminder: 'Deploy feature' deadline is approaching" |

## Cron Job 1: Due Soon Notifications (`task-due-soon-check`)

### Schedule
Run every **15 minutes** (configurable).

### Logic

```typescript
// Pseudocode for src/crons/task-due-soon-check.ts

import cron from "node-cron";
import { prisma } from "../lib/prisma";
import { notifyUser } from "../sockets/notification.stream";

// Configurable reminder hours (from user settings or defaults)
const DEFAULT_REMINDER_HOURS = [3, 6];

cron.schedule("*/15 * * * *", async () => {
  const now = new Date();

  // 1. Find tasks with due dates in the future (within max reminder window)
  const maxReminderHours = Math.max(...DEFAULT_REMINDER_HOURS);
  const maxReminderDate = new Date(now.getTime() + maxReminderHours * 60 * 60 * 1000);

  const tasksDueSoon = await prisma.task.findMany({
    where: {
      dueDate: {
        not: null,
        gt: now,                    // Not yet past due
        lte: maxReminderDate,       // Within reminder window
      },
      status: {
        notIn: ["COMPLETED", "CANCELLED"],  // Skip completed/cancelled
      },
    },
    include: {
      assignees: {
        include: { user: true },
      },
    },
  });

  // 2. For each task, check each assignee's notification preferences
  for (const task of tasksDueSoon) {
    const hoursUntilDue =
      (new Date(task.dueDate!).getTime() - now.getTime()) / (1000 * 60 * 60);

    for (const assignee of task.assignees) {
      // Check if user has due date reminders enabled
      const prefs = await prisma.userNotificationPreference.findUnique({
        where: { userId: assignee.user.id },
      });

      if (!prefs?.taskDueSoon) continue; // User disabled reminders

      // Check if this hour threshold matches user's configured hours
      const userHours = prefs.dueDateReminderHours || DEFAULT_REMINDER_HOURS;
      const matchesReminder = userHours.some(
        (h: number) => hoursUntilDue > 0 && hoursUntilDue <= h + 0.25 // +15min tolerance for cron interval
      );

      if (!matchesReminder) continue;

      // 3. Check for duplicate notification (don't re-notify)
      const existingNotification = await prisma.notification.findFirst({
        where: {
          recipientId: assignee.user.id,
          type: "TASK_DUE_SOON",
          metadata: { taskId: task.id },  // Assuming metadata JSON field
          createdAt: {
            gte: new Date(now.getTime() - 60 * 60 * 1000), // Within last hour
          },
        },
      });

      if (existingNotification) continue;

      // 4. Create notification
      const notification = await prisma.notification.create({
        data: {
          recipientId: assignee.user.id,
          senderId: task.createdById,
          type: "TASK_DUE_SOON",
          title: "Task Due Soon",
          message: `Task "${task.title}" is due in ${Math.ceil(hoursUntilDue)} hours`,
          actionUrl: `/dashboard/tasks/${task.id}`,
          metadata: { taskId: task.id },
        },
      });

      // 5. Send via SSE
      notifyUser(assignee.user.id, notification);
    }
  }

  console.log(`[CRON] task-due-soon-check: processed ${tasksDueSoon.length} tasks`);
});
```

## Cron Job 2: Overdue Notifications (`task-overdue-check`)

### Schedule
Run every **30 minutes**.

### Logic

```typescript
// Pseudocode for src/crons/task-overdue-check.ts

cron.schedule("*/30 * * * *", async () => {
  const now = new Date();

  // 1. Find tasks that are past due and not completed
  const overdueTasks = await prisma.task.findMany({
    where: {
      dueDate: {
        not: null,
        lt: now,  // Past due date
      },
      status: {
        notIn: ["COMPLETED", "CANCELLED"],
      },
    },
    include: {
      assignees: {
        include: { user: true },
      },
    },
  });

  for (const task of overdueTasks) {
    for (const assignee of task.assignees) {
      // Check user preferences
      const prefs = await prisma.userNotificationPreference.findUnique({
        where: { userId: assignee.user.id },
      });

      if (!prefs?.taskOverdue) continue;

      // Check for duplicate (only notify once per day for overdue)
      const existingNotification = await prisma.notification.findFirst({
        where: {
          recipientId: assignee.user.id,
          type: "TASK_OVERDUE",
          metadata: { taskId: task.id },
          createdAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Within last 24h
          },
        },
      });

      if (existingNotification) continue;

      const hoursOverdue = Math.abs(
        (new Date(task.dueDate!).getTime() - now.getTime()) / (1000 * 60 * 60)
      );

      const notification = await prisma.notification.create({
        data: {
          recipientId: assignee.user.id,
          senderId: task.createdById,
          type: "TASK_OVERDUE",
          title: "Task Overdue",
          message: `Task "${task.title}" is ${Math.floor(hoursOverdue)} hours overdue`,
          actionUrl: `/dashboard/tasks/${task.id}`,
          metadata: { taskId: task.id },
        },
      });

      notifyUser(assignee.user.id, notification);
    }
  }

  console.log(`[CRON] task-overdue-check: processed ${overdueTasks.length} tasks`);
});
```

## Database Schema Additions

### UserNotificationPreference (if not exists)

```prisma
model UserNotificationPreference {
  id                     String   @id @default(cuid())
  userId                 String   @unique
  taskDueSoon            Boolean  @default(true)
  taskOverdue            Boolean  @default(true)
  dueDateReminderHours   Int[]    @default([3, 6])  // Hours before due to notify
  // ... other notification preferences
}
```

### Notification (if not exists)

```prisma
model Notification {
  id          String   @id @default(cuid())
  recipientId String
  senderId    String?
  type        NotificationType
  title       String
  message     String
  read        Boolean  @default(false)
  readAt      DateTime?
  actionUrl   String?
  metadata    Json?    // { taskId: string } for due date notifications
  createdAt   DateTime @default(now())

  @@index([recipientId, type, createdAt])
}
```

## Duplicate Prevention Strategy

| Notification Type | Dedup Window | Logic |
|-------------------|-------------|-------|
| `TASK_DUE_SOON` | 1 hour | Don't re-notify if same task notification exists within 1 hour |
| `TASK_OVERDUE` | 24 hours | Don't re-notify if same task notification exists within 24 hours |
| `DEADLINE_REMINDER` | Configurable | Based on reminder interval |

## API Endpoints to Add

### Update Notification Preferences

```
PUT /api/v1/user/notifications
Body: {
  taskDueSoon: boolean,
  taskOverdue: boolean,
  dueDateReminderHours: number[]
}
```

### Get Notification Preferences

```
GET /api/v1/user/notifications
Response: {
  taskDueSoon: boolean,
  taskOverdue: boolean,
  dueDateReminderHours: number[]
}
```

## Frontend Integration (Already Done)

The frontend already handles:
1. ✅ `TASK_DUE_SOON`, `TASK_OVERDUE`, `DEADLINE_REMINDER` notification types in the enum
2. ✅ Query invalidation for task notifications on SSE receive
3. ✅ `DueDateBadge` component for displaying due date status
4. ✅ `DueDateReminderSettings` component for user preferences
5. ✅ `useTaskDueDate` hook for computing due date info
6. ✅ Notification preferences UI in Settings

## Testing

### Unit Tests
- Test cron job finds correct tasks (due soon, overdue, not completed)
- Test duplicate prevention logic
- Test user preference filtering

### Integration Tests
- Test full flow: task created with due date → cron runs → notification created → SSE sends → frontend receives
- Test that completed tasks don't trigger notifications
- Test that disabled user preferences prevent notifications

### Manual Testing
1. Create a task with due date 3 hours from now
2. Wait for cron to run (or trigger manually)
3. Verify notification appears in bell dropdown
4. Verify task list refreshes (query invalidation)
5. Complete the task before due date
6. Verify no overdue notification is sent
