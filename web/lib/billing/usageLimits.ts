import type { UserPlan } from "./types";

// Monthly usage limits per plan. Preparation only — these are NOT yet enforced
// on the existing API routes (that requires auth + server-side usage tracking).

export const FREE_LIMITS = {
  monthlyAnalysisLimit: 10,
  monthlyPreviewLimit: 3
};

export const PRO_LIMITS = {
  monthlyAnalysisLimit: 300,
  monthlyPreviewLimit: 50
};

export function getLimitsForPlan(plan: UserPlan) {
  return plan === "pro" ? PRO_LIMITS : FREE_LIMITS;
}
