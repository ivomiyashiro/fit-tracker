import type { MuscleGroup } from "@/web/modules/exercises/types";

class MuscleGroupsService {
  async getMuscleGroups(): Promise<MuscleGroup[]> {
    // TODO: Implementar endpoint en el backend
    // Por ahora retornamos datos mock
    return await Promise.resolve([
      { id: 1, name: "Chest" },
      { id: 2, name: "Back" },
      { id: 3, name: "Shoulders" },
      { id: 4, name: "Biceps" },
      { id: 5, name: "Triceps" },
      { id: 6, name: "Legs" },
      { id: 7, name: "Glutes" },
      { id: 8, name: "Abs" },
      { id: 9, name: "Calves" },
      { id: 10, name: "Forearms" },
    ]);
  }
}

export const muscleGroupsService = new MuscleGroupsService();
