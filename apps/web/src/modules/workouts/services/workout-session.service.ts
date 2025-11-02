import type { WorkoutSession, WorkoutSessionDetail, WorkoutSessionSummary } from "@/web/modules/workouts/types";

import { apiClient } from "@/web/lib/api-client";

type CreateWorkoutSessionRequest = {
  workoutId: number;
  completedAt?: string;
  duration?: number;
  notes?: string;
};

type UpdateWorkoutSessionRequest = {
  completedAt?: string;
  duration?: number;
  notes?: string;
};

class WorkoutSessionService {
  async createWorkoutSession(request: CreateWorkoutSessionRequest): Promise<WorkoutSession> {
    return await apiClient.post(`/workout-sessions`, request);
  }

  async getActiveWorkoutSession(): Promise<WorkoutSessionDetail> {
    return await apiClient.get(`/workout-sessions/active`);
  }

  async getWorkoutSession(sessionId: number): Promise<WorkoutSessionDetail> {
    return await apiClient.get(`/workout-sessions/${sessionId}`);
  }

  async getWorkoutSessionSummary(sessionId: number): Promise<WorkoutSessionSummary> {
    return await apiClient.get(`/workout-sessions/${sessionId}/summary`);
  }

  async updateWorkoutSession(sessionId: number, data: UpdateWorkoutSessionRequest): Promise<WorkoutSession> {
    return await apiClient.patch(`/workout-sessions/${sessionId}`, data);
  }

  async deleteWorkoutSession(sessionId: number): Promise<void> {
    return await apiClient.delete(`/workout-sessions/${sessionId}`);
  }
}

export const workoutSessionService = new WorkoutSessionService();
