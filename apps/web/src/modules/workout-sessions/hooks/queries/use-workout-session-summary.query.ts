import { useQuery } from "@tanstack/react-query";

import { workoutSessionService } from "@/web/modules/workout-sessions/services/workout-session.service";
import { workoutSessionKeys } from "@/web/modules/workouts/utils";

export const useWorkoutSessionSummaryQuery = (sessionId: number) => {
  return useQuery({
    queryKey: workoutSessionKeys.summary(sessionId),
    queryFn: () => workoutSessionService.getWorkoutSessionSummary(sessionId),
    enabled: !!sessionId,
  });
};
