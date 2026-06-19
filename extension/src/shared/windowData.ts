import type { LayoutPattern } from "../patterns/layoutPatterns";
import type { TemplateReference } from "../patterns/templateReferences";
import type { AnimationReference } from "../patterns/animationReferences";
import type { UncodixifyAnalysisResult } from "../analysis/uncodixifyTypes";
import type { PolishPilotMode } from "./types";

// Payload the side panel writes for the Design Ideas floating window.
export type DesignIdeasData = {
  mode: PolishPilotMode;
  hasAnalysis: boolean;
  sourceTitle?: string;
  sourceUrl?: string;
  layoutPatterns: LayoutPattern[];
  templateReferences: TemplateReference[];
  animationReferences: AnimationReference[];
  // Why the layouts fit (designer description / current problem), shown as context.
  fitReason?: string;
  selectedPatternId?: string | null;
  selectedTemplateId?: string | null;
  selectedAnimationId?: string | null;
};

// Payload the side panel writes for the Recommendations floating window.
export type RecommendationsData = {
  mode: PolishPilotMode;
  hasAnalysis: boolean;
  sourceTitle?: string;
  sourceUrl?: string;
  analysis: UncodixifyAnalysisResult | null;
  // Rule ids the user has excluded from the Cursor prompt.
  excludedRuleIds: string[];
};
