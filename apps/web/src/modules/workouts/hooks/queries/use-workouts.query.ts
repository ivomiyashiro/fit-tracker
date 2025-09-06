import { useSuspenseQuery } from "@tanstack/react-query";

import { workoutService } from "@/web/modules/workouts/services/workouts.service";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";

export const useWorkoutsQuery = () => {
  return useSuspenseQuery({
    queryKey: workoutQueryKeys.lists(),
    queryFn: () => workoutService.getWorkouts(),
  });
};
