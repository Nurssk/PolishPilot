import type { UserPlan } from "./types";

export const FREE_LIMITS = {
  monthlyAnalysisLimit: 5,
  monthlyScreenshotLimit: 5,
  monthlyPreviewLimit: 3
};

export const PRO_LIMITS = {
  monthlyAnalysisLimit: 300,
  monthlyScreenshotLimit: 300,
  monthlyPreviewLimit: 50
};

export function getLimitsForPlan(plan: UserPlan) {
  return plan === "pro" ? PRO_LIMITS : FREE_LIMITS;
}
