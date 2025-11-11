import { useQuery } from "@tanstack/react-query";

import { workoutSessionService } from "@/web/modules/workout-sessions/services/workout-session.service";
import { workoutSessionKeys } from "@/web/modules/workout-sessions/utils";

export const useWorkoutSessionsQuery = (year?: number, month?: number) => {
  return useQuery({
    queryKey: workoutSessionKeys.list(year, month),
    queryFn: () => workoutSessionService.getWorkoutSessions(year, month),
  });
};
