import type { CreateSetRequest, UpdateSetRequest } from "@/dtos/sets/requests";
import type { SetPaginatedResponse } from "@/dtos/sets/responses";
import type { WorkoutExerciseSet } from "@/web/modules/workouts/types";

import { apiClient } from "@/web/lib/api-client";

class WorkoutExerciseSetService {
  async getPaginatedWorkoutExerciseSets(
    workoutExerciseId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<SetPaginatedResponse> {
    return await apiClient.get(
      `/sets?workoutExerciseId=${workoutExerciseId}&page=${page}&limit=${limit}`,
    );
  }

  async createWorkoutExerciseSet(workoutExerciseSet: CreateSetRequest): Promise<WorkoutExerciseSet> {
    return await apiClient.post(`/sets`, workoutExerciseSet);
  }

  async getWorkoutExerciseSet(setId: number): Promise<WorkoutExerciseSet> {
    return await apiClient.get(`/sets/${setId}`);
  }

  async updateWorkoutExerciseSet(setId: number, workoutExerciseSet: UpdateSetRequest): Promise<WorkoutExerciseSet> {
    return await apiClient.put(`/sets/${setId}`, workoutExerciseSet);
  }

  async deleteWorkoutExerciseSet(setId: number): Promise<void> {
    return await apiClient.delete(`/sets/${setId}`);
  }
}

export const workoutExerciseSetService = new WorkoutExerciseSetService();
