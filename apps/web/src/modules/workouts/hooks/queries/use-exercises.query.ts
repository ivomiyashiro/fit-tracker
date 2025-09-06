import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";

import { exercisesService } from "@/web/modules/workouts/services/exercises.service";
import { exercisesQueryKeys } from "@/web/modules/workouts/utils/exercises.query-keys";

// Hook to get exercises
export const useExercisesQuery = (search: string) => {
  return useSuspenseQuery({
    queryKey: exercisesQueryKeys.detail(search),
    queryFn: () => exercisesService.getExercises({ page: 1, limit: 20, search }),
  });
};

// Hook to get paginated exercises with infinite query
export const useInfiniteExercisesQuery = (search: string) => {
  return useInfiniteQuery({
    queryKey: exercisesQueryKeys.infinite(search),
    queryFn: ({ pageParam = 1 }) =>
      exercisesService.getExercises({
        page: pageParam,
        limit: 20,
        search,
      }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
