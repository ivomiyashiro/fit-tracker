import { useQuery } from "@tanstack/react-query";

import { workoutService } from "@/web/modules/workouts/services/workouts.service";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";

export const useWorkoutByIdQuery = (workoutId: number) => {
  const query = useQuery({
    queryKey: workoutQueryKeys.detail(workoutId),
    queryFn: () => workoutService.getWorkoutById(workoutId),
  });

  return {
    ...query,
    isLoading: query.isLoading || (query.isFetching && !query.data),
    isRefetching: query.isFetching && !!query.data,
  };
};
