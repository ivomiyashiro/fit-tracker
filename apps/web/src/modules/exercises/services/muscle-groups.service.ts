import type { MuscleGroupFull } from "@/web/modules/exercises/types";

import { apiClient } from "@/web/lib/api-client";

class MuscleGroupsService {
  async getMuscleGroups(): Promise<MuscleGroupFull[]> {
    return await apiClient.get(`/muscle-groups`);
  }
}

export const muscleGroupsService = new MuscleGroupsService();
