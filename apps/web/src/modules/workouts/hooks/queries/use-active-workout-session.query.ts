import { useQuery } from "@tanstack/react-query";

import { workoutSessionService } from "@/web/modules/workout-sessions/services";
import { workoutSessionKeys } from "@/web/modules/workout-sessions/utils";

export const useActiveWorkoutSessionQuery = () => {
  return useQuery({
    queryKey: workoutSessionKeys.active(),
    queryFn: () => workoutSessionService.getActiveWorkoutSession(),
    retry: 0,
  });
};
