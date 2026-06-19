// Placeholder billing types. The project currently has no auth/user database,
// so these are not yet persisted anywhere. They define the shape that the
// webhook handler will map Polar events into once auth/DB exists.

export type UserPlan = "free" | "pro";

export type UserBillingState = {
  userId: string;
  email?: string;
  plan: UserPlan;
  polarCustomerId?: string;
  polarSubscriptionId?: string;
  subscriptionStatus?:
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "incomplete"
    | "unknown";
  currentPeriodEnd?: string;
};
