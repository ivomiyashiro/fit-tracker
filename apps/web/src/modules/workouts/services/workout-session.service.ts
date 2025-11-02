import type { WorkoutSession } from "@/web/modules/workouts/types";

import { apiClient } from "@/web/lib/api-client";

type CreateWorkoutSessionRequest = {
  workoutId: number;
  completedAt?: string;
  duration?: number;
  notes?: string;
};

class WorkoutSessionService {
  async createWorkoutSession(request: CreateWorkoutSessionRequest): Promise<WorkoutSession> {
    return await apiClient.post(`/workout-sessions`, request);
  }

  async deleteWorkoutSession(sessionId: number): Promise<void> {
    return await apiClient.delete(`/workout-sessions/${sessionId}`);
  }
}

export const workoutSessionService = new WorkoutSessionService();
