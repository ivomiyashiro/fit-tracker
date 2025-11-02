import type { ExerciseResponse } from "@/dtos/exercises/responses";
import type { SingleExercise } from "@/web/modules/exercises/types";

import { apiClient } from "@/web/lib/api-client";

type GetExercisesParams = {
  page: number;
  limit: number;
  search?: string;
};

type CreateExerciseParams = {
  name: string;
  muscleGroupIds: number[];
};

type UpdateExerciseParams = {
  name?: string;
  muscleGroupIds?: number[];
};

class ExercisesService {
  async getExercises(query: GetExercisesParams): Promise<ExerciseResponse> {
    return await apiClient.get(`/exercises`, { query });
  }

  async getExercise(id: number): Promise<SingleExercise> {
    return await apiClient.get(`/exercises/${id}`);
  }

  async createExercise(data: CreateExerciseParams): Promise<SingleExercise> {
    return await apiClient.post(`/exercises`, data);
  }

  async updateExercise(id: number, data: UpdateExerciseParams): Promise<SingleExercise> {
    return await apiClient.put(`/exercises/${id}`, data);
  }

  async deleteExercises(exerciseIds: number[]): Promise<void> {
    return await apiClient.delete(`/exercises`, exerciseIds);
  }
}

export const exercisesService = new ExercisesService();
