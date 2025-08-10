import { useSuspenseQuery } from "@tanstack/react-query";

import { useCache } from "@/web/hooks";
import { workoutService } from "@/web/modules/workouts/api";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";

export const useWorkoutSuspenseQuery = () => {
  return useSuspenseQuery({
    queryKey: workoutQueryKeys.all,
    queryFn: () => workoutService.getWorkouts(),
    refetchOnMount: false,
  });
};

export const useCachedOrWorkoutSuspenseQuery = () => {
  const workoutsData = useCache<GetWorkoutsResponse>(workoutQueryKeys.all);

  return useSuspenseQuery({
    queryKey: workoutQueryKeys.all,
    queryFn: () => workoutService.getWorkouts(),
    initialData: workoutsData,
    staleTime: workoutsData ? Infinity : 0,
  });
};
