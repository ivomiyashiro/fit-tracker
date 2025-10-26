import { useQuery } from "@tanstack/react-query";

import { workoutExerciseSetService } from "@/web/modules/workouts/services/workout-exercise-set.service";
import { workoutExerciseSetsQueryKeys } from "@/web/modules/workouts/utils";

export const useWorkoutExerciseSetByIdQuery = (setId: number) => {
  const query = useQuery({
    queryKey: workoutExerciseSetsQueryKeys.detail(setId),
    queryFn: () => workoutExerciseSetService.getWorkoutExerciseSet(setId),
  });

    return {
    ...query,
    isLoading: query.isLoading || (query.isFetching && !query.data),
    isRefetching: query.isFetching && !!query.data,
  };
};
