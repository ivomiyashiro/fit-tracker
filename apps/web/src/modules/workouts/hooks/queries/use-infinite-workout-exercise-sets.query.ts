import { useInfiniteQuery } from "@tanstack/react-query";

import { workoutExerciseSetService } from "@/web/modules/workouts/services/workout-exercise-set.service";
import { workoutExerciseSetsQueryKeys } from "@/web/modules/workouts/utils";

export const useInfiniteWorkoutExerciseSetsQuery = (
  workoutExerciseId: number,
  limit: number = 10,
) => {
  return useInfiniteQuery({
    queryKey: workoutExerciseSetsQueryKeys.infinite(workoutExerciseId, limit),
    queryFn: ({ pageParam = 1 }) =>
      workoutExerciseSetService.getPaginatedWorkoutExerciseSets(
        workoutExerciseId,
        pageParam,
        limit,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const { page } = firstPage.pagination;
      return page > 1 ? page - 1 : undefined;
    },
  });
};
