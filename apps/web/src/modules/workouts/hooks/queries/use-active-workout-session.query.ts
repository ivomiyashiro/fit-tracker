import { useQuery } from "@tanstack/react-query";

import { workoutSessionService } from "@/web/modules/workouts/services";
import { workoutSessionKeys } from "@/web/modules/workouts/utils";

export const useActiveWorkoutSessionQuery = () => {
  return useQuery({
    queryKey: workoutSessionKeys.active(),
    queryFn: () => workoutSessionService.getActiveWorkoutSession(),
    retry: 0,
    staleTime: 1000 * 60 * 5,
  });
};
