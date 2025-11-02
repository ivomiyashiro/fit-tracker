import { useQuery } from "@tanstack/react-query";

import { workoutService } from "@/web/modules/workouts/services";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";

export const useNextWorkoutQuery = () => {
  return useQuery({
    queryKey: workoutQueryKeys.next(),
    queryFn: () => workoutService.getNextWorkout(),
    staleTime: 1000 * 60 * 5,
  });
};
