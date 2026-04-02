"use client";

import { useCallback, useMemo, useState } from "react";
import type {  HelpArticle, HelpTopic, HelpTopicId } from "@/types/help.types";

const TOPICS_DATA: HelpTopic[] = [
  {
    id: "getting-started",
    label: "Getting started",
    icon: "🚀",
    description: "Set up your workspace and start collaborating in minutes.",
    accentColor: "#378ADD",
    articles: [
      {
        id: "gs-1",
        topicId: "getting-started",
        title: "Create your first workspace",
        description:
          "Walk through setting up a workspace, inviting members, and configuring roles.",
        tag: "guide",
        keywords: ["workspace", "setup", "create", "start", "new"],
        docsPath: "/docs/getting-started/create-workspace"
      },
      {
        id: "gs-2",
        topicId: "getting-started",
        title: "Dashboard overview",
        description:
          "Learn what each panel does — sidebar, header bar, activity feed, and task board.",
        tag: "guide",
        keywords: ["dashboard", "overview", "panel", "layout"],
        docsPath: "/docs/core-concepts/overview"
      },
    ],
    steps: [
      {
        step: 1,
        title: "Create or join a workspace",
        description:
          "Go to Workspaces → New workspace. Enter a name and choose visibility (private or public).",
      },
      {
        step: 2,
        title: "Invite your team",
        description:
          "Open the Members panel, paste email addresses, and assign roles (Admin, Editor, Viewer).",
      },
      {
        step: 3,
        title: "Create your first project",
        description:
          "Click + New Project from the sidebar. Add a description, set a deadline, and assign an owner.",
      },
      {
        step: 4,
        title: "Add tasks and assign them",
        description:
          "Inside a project, click + Add Task. Set priority, due date, and link it to a team member.",
      },
    ],
    notice:
      "New to Focura? The interactive onboarding tour appears automatically on your first login — click Resume Tour anytime from the Help menu.",
  },
  {
    id: "workspace",
    label: "Workspace",
    icon: "🏢",
    description: "Roles, permissions, settings, and member controls.",
    accentColor: "#1D9E75",
    articles: [
      {
        id: "ws-1",
        topicId: "workspace",
        title: "Roles & permissions",
        description:
          "Admin, Editor, and Viewer — what each role can and cannot do inside a workspace.",
        tag: "reference",
        keywords: ["role", "permission", "admin", "editor", "viewer"],
        docsPath: ""

      },
      {
        id: "ws-2",
        topicId: "workspace",
        title: "Managing members",
        description:
          "Invite, remove, or change a member's role. Understand seat limits and billing impact.",
        tag: "guide",
        keywords: ["member", "invite", "remove", "seat", "billing"],
        docsPath: ""

      },
      {
        id: "ws-3",
        topicId: "workspace",
        title: "Workspace settings",
        description:
          "Rename your workspace, change the avatar, set default visibility, and configure notifications.",
        tag: "tip",
        keywords: ["settings", "rename", "avatar", "notification"],
        docsPath: ""

      },
    ],
    notice: undefined,
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: "✅",
    description: "Create, assign, filter, and track work across your team.",
    accentColor: "#BA7517",
    articles: [
      {
        id: "t-1",
        topicId: "tasks",
        title: "Task statuses explained",
        description:
          "Todo, In progress, In review, Blocked, and Done — when to use each and how to transition.",
        tag: "guide",
        keywords: ["status", "todo", "progress", "done", "blocked"],
        docsPath: ""

      },
      {
        id: "t-2",
        topicId: "tasks",
        title: "Filtering & grouping",
        description:
          "Use the filter bar to slice tasks by assignee, priority, due date, or custom label.",
        tag: "tip",
        keywords: ["filter", "group", "assignee", "priority", "label"],
        docsPath: ""

      },
      {
        id: "t-3",
        topicId: "tasks",
        title: "Subtasks & dependencies",
        description:
          "Break work into subtasks and link blocking relationships between tasks across projects.",
        tag: "new",
        keywords: ["subtask", "dependency", "block", "child", "nested"],
        docsPath: ""

      },
    ],
    notice: undefined,
  },
  {
    id: "contact",
    label: "Contact",
    icon: "💬",
    description: "Reach our team through any of the channels below.",
    accentColor: "#888780",
    articles: [],
    notice:
      "Enterprise customers have a dedicated Slack channel and a named customer success manager.",
  },
];

export function useHelpTopics() {
  const topics = useMemo(() => TOPICS_DATA, []);

  const getTopicById = (id: string) =>
    topics.find((t) => t.id === id) ?? null;

  return { topics, getTopicById };
}




export interface HelpSearchResult {
  type: "article" | "faq";
  id: string;
  title: string;
  description: string;
  topicId: HelpTopicId;
  score: number;
}



export interface HelpSearchResult {
  type: "article" | "faq";
  id: string;
  title: string;
  description: string;
  topicId: HelpTopicId;
  score: number;
  /** Only present when type === "article" */
  docsPath?: string;
}

function tokenize(str: string): string[] {
  return str.toLowerCase().split(/\s+/).filter(Boolean);
}

function scoreText(haystack: string, needles: string[]): number {
  const h = haystack.toLowerCase();
  return needles.reduce((acc, needle) => {
    if (h.includes(needle)) acc += needle.length > 3 ? 2 : 1;
    return acc;
  }, 0);
}

export function useHelpSearch() {
  const [query, setQuery] = useState("");
  const { topics } = useHelpTopics();

  const allArticles = useMemo<HelpArticle[]>(
    () => topics.flatMap((t) => t.articles),
    [topics]
  );

  const results = useMemo<HelpSearchResult[]>(() => {
    const q = query.trim();
    if (!q) return [];

    const needles = tokenize(q);

    const articleResults: HelpSearchResult[] = allArticles
      .map((a) => {
        const score =
          scoreText(a.title, needles) * 3 +
          scoreText(a.description, needles) * 2 +
          scoreText(a.keywords.join(" "), needles);
        return {
          type: "article" as const,
          id: a.id,
          title: a.title,
          description: a.description,
          topicId: a.topicId,
          score,
        };
      })
      .filter((r) => r.score > 0);


    return [...articleResults].sort((a, b) => b.score - a.score);
  }, [query, allArticles]);

  const clear = useCallback(() => setQuery(""), []);

  const hasResults = results.length > 0;
  const isEmpty = query.trim().length > 0 && !hasResults;

  return { query, setQuery, results, hasResults, isEmpty, clear };
}