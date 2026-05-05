import type { ReactNode } from "react";
import {
  OverviewSection,
  SetupSection,
  FrontendArchSection,
  BackendArchSection,
  AuthSection,
  ApiLayerSection,
  DatabaseSection,
  CachingSection,
  RealtimeSection,
  AddingFeatureSection,
  TestingSection,
  EnvVarsSection,
  ConventionsSection,
} from "./";

const SECTION_MAP: Record<string, ReactNode> = {
  "overview":       <OverviewSection />,
  "setup":          <SetupSection />,
  "frontend-arch":  <FrontendArchSection />,
  "backend-arch":   <BackendArchSection />,
  "auth":           <AuthSection />,
  "api-layer":      <ApiLayerSection />,
  "database":       <DatabaseSection />,
  "caching":        <CachingSection />,
  "realtime":       <RealtimeSection />,
  "adding-feature": <AddingFeatureSection />,
  "testing":        <TestingSection />,
  "env-vars":       <EnvVarsSection />,
  "conventions":    <ConventionsSection />,
};

export function useDevSectionContent(activeId: string): ReactNode {
  return SECTION_MAP[activeId] ?? null;
}