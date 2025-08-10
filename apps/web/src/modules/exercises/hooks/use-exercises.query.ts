import { useSuspenseQuery } from "@tanstack/react-query";

import { useCache } from "@/web/hooks";
import { exercisesService } from "@/web/modules/exercises/exercises.api";
import { exercisesQueryKeys } from "@/web/modules/exercises/exercises.query-keys";

// Hook to get exercises
export const useExercisesQuery = () => {
  return useSuspenseQuery({
    queryKey: exercisesQueryKeys.lists(),
    queryFn: exercisesService.getExercises,
  });
};

export const useCachedOrExercisesQuery = () => {
  const exercisesData = useCache<GetExercisesResponse>(exercisesQueryKeys.lists());

  return useSuspenseQuery({
    queryKey: exercisesQueryKeys.lists(),
    queryFn: () => exercisesService.getExercises(),
    initialData: exercisesData,
    staleTime: exercisesData ? Infinity : 0,
  });
};
