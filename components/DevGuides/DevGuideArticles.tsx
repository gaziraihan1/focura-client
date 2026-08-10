"use client";

import type { GuideArticle } from "@/types/guides.types";
import { overviewArticles, setupArticles } from "./OverviewSetup";
import { frontendArchArticles, backendArchArticles } from "./ArchSection";
import {
  apiLayerArticles,
  authArticles,
  cachingArticles,
  databaseArticles,
  realtimeArticles,
} from "./TechSection";
import {
  addingFeatureArticles,
  conventionsArticles,
  envVarsArticles,
  testingArticles,
} from "./WorkflowSection";
import { aiArticles } from "./AiSection";

/** Rich article content per dev-guide section, keyed by section id. */
export const DEV_ARTICLE_MAP: Record<string, GuideArticle[]> = {
  overview: overviewArticles,
  setup: setupArticles,
  "frontend-arch": frontendArchArticles,
  "backend-arch": backendArchArticles,
  auth: authArticles,
  "api-layer": apiLayerArticles,
  database: databaseArticles,
  caching: cachingArticles,
  realtime: realtimeArticles,
  "adding-feature": addingFeatureArticles,
  testing: testingArticles,
  "env-vars": envVarsArticles,
  conventions: conventionsArticles,
  ai: aiArticles,
};
