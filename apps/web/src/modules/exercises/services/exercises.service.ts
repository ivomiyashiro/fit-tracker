import type { ExerciseResponse } from "@/dtos/exercises/responses";

import { apiClient } from "@/web/lib/api-client";

type GetExercisesParams = {
  page: number;
  limit: number;
  search?: string;
};

class ExercisesService {
  async getExercises(query: GetExercisesParams): Promise<ExerciseResponse> {
    return await apiClient.get(`/exercises`, { query });
  }

  async deleteExercises(exerciseIds: number[]): Promise<void> {
    return await apiClient.delete(`/exercises`, exerciseIds);
  }
}

export const exercisesService = new ExercisesService();
