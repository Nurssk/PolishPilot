// Static configuration for the single paid plan (LookRight Pro).
// This mirrors the product/metadata that must be created manually in Polar.
// See web/POLAR_SETUP.md for the manual setup steps.

export const POLAR_PRODUCT = {
  key: "lookright_pro",
  name: "LookRight Pro",
  plan: "pro",
  monthlyAnalysisLimit: 300,
  monthlyPreviewLimit: 50,
  features: ["uncodixify", "ai_preview", "cursor_prompt", "gallery"]
} as const;

export function isProPlan(plan?: string | null): boolean {
  return plan === "pro";
}
