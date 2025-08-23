import { useSuspenseQuery } from "@tanstack/react-query";

import { workoutService } from "@/web/modules/workouts/services/workouts.service";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";

export const useWorkoutByIdQuery = (workoutId: number) => {
  return useSuspenseQuery({
    queryKey: workoutQueryKeys.detail(workoutId),
    queryFn: () => workoutService.getWorkoutById(workoutId),
  });
};
