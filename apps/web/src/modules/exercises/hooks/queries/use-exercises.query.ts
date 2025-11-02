import { useInfiniteQuery } from "@tanstack/react-query";

import { exercisesService } from "@/web/modules/exercises/services/exercises.service";
import { exercisesQueryKeys } from "@/web/modules/exercises/utils";

// Hook to get paginated exercises with infinite query
export const useInfiniteExercisesQuery = (search: string) => {
  return useInfiniteQuery({
    queryKey: exercisesQueryKeys.list(search),
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
