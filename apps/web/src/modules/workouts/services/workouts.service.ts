import { apiClient } from "@/web/lib/api-client";
import { Workout } from "@/web/modules/workouts/types";
import { CreateWorkoutRequest, UpdateWorkoutRequest } from "@/dtos/workouts/requests";

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
}   

export const workoutService = new WorkoutService();