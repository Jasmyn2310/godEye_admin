export type PlanTargetRole = 'vendor' | 'client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  isPopular: boolean;
  targetRole: PlanTargetRole;
  durationDays: number;
}

export interface CreatePlanPayload {
  name: string;
  price: number;
  description: string;
  isPopular?: boolean;
  targetRole: PlanTargetRole;
  durationDays?: number;
}

export interface UpdatePlanPayload {
  name?: string;
  price?: number;
  description?: string;
  isPopular?: boolean;
  targetRole?: PlanTargetRole;
  durationDays?: number;
}
