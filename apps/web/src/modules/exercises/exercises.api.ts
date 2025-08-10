import type { GetExercisesResponse } from "@fit-tracker/api-client";

import { httpClient } from "@/web/lib/http/http.client";

class ExercisesService {
  async getExercises(): Promise<GetExercisesResponse> {
    return await httpClient.get<GetExercisesResponse>(`/exercises`);
  }
}

export const exercisesService = new ExercisesService();
