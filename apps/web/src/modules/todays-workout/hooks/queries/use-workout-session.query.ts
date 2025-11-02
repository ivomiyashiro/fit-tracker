import { useQuery } from "@tanstack/react-query";

import { workoutSessionService } from "@/web/modules/workouts/services/workout-session.service";
import { workoutSessionKeys } from "@/web/modules/workouts/utils";

export const useWorkoutSessionQuery = (sessionId: number) => {
  return useQuery({
    queryKey: workoutSessionKeys.detail(sessionId),
    queryFn: () => workoutSessionService.getWorkoutSession(sessionId),
    enabled: !!sessionId,
  });
};
