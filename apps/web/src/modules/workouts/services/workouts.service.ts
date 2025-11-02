import type { CreateWorkoutRequest, UpdateWorkoutRequest } from "@/dtos/workouts/requests";
import type { Workout } from "@/web/modules/workouts/types";

import { apiClient } from "@/web/lib/api-client";

class WorkoutService {
  async getWorkoutById(workoutId: number): Promise<Workout> {
    return await apiClient.get(`/workouts/${workoutId}`);
  }

  async getWorkouts(): Promise<Workout[]> {
    return await apiClient.get(`/workouts`);
  }

  async createWorkout(workout: CreateWorkoutRequest): Promise<Workout> {
    return await apiClient.post(`/workouts`, workout);
  }

  async updateWorkout(
    workoutId: number,
    workout: UpdateWorkoutRequest,
  ): Promise<Workout> {
    return await apiClient.put(`/workouts/${workoutId}`, workout);
  }

  async deleteWorkouts(workoutIds: number[]): Promise<void> {
    return await apiClient.delete(`/workouts`, workoutIds);
  }

  async getNextWorkout(): Promise<Workout> {
    return await apiClient.get(`/workouts/next`);
  }

  async reorderWorkouts(workouts: Array<{ id: number; order: number }>): Promise<void> {
    return await apiClient.patch(`/workouts/reorder`, { workouts });
  }
}

export const workoutService = new WorkoutService();
