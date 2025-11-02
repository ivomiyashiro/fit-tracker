import type { SingleExercise } from "@/web/modules/exercises/types";

import { useQuery } from "@tanstack/react-query";

import { exercisesService } from "@/web/modules/exercises/services";

export const useExerciseQuery = (id: number) => {
  return useQuery<SingleExercise, Error>({
    queryKey: ["exercise", id],
    queryFn: () => exercisesService.getExercise(id),
  });
};
