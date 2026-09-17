import { apiClient } from './api-client';
import type {
  CreatePlanPayload,
  PlanTargetRole,
  SubscriptionPlan,
  UpdatePlanPayload,
} from '../types/subscription.types';

export const subscriptionsService = {
  async getPlans(token: string, targetRole?: PlanTargetRole): Promise<SubscriptionPlan[]> {
    const query = targetRole ? `?targetRole=${encodeURIComponent(targetRole)}` : '';
    return apiClient.get<SubscriptionPlan[]>(`/subscriptions/plans${query}`, { token });
  },

  async createPlan(token: string, payload: CreatePlanPayload): Promise<SubscriptionPlan> {
    return apiClient.post<SubscriptionPlan, CreatePlanPayload>('/subscriptions/plans', payload, {
      token,
    });
  },

  async updatePlan(
    token: string,
    id: string,
    payload: UpdatePlanPayload,
  ): Promise<SubscriptionPlan> {
    return apiClient.put<SubscriptionPlan, UpdatePlanPayload>(
      `/subscriptions/plans/${encodeURIComponent(id)}`,
      payload,
      { token },
    );
  },

  async deletePlan(token: string, id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/subscriptions/plans/${encodeURIComponent(id)}`,
      { token },
    );
  },
};
