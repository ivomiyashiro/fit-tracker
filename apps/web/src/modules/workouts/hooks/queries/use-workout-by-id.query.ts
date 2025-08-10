import { useSuspenseQuery } from "@tanstack/react-query";

import { useCache } from "@/web/hooks";
import { workoutService } from "@/web/modules/workouts/api";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";

export const useWorkoutByIdSuspenseQuery = (workoutId: number) => {
  return useSuspenseQuery({
    queryKey: [workoutQueryKeys.detail(workoutId)],
    queryFn: () => workoutService.getWorkoutById(workoutId),
  });
};

export const useCachedOrWorkoutByIdSuspenseQuery = (workoutId: number) => {
  const workoutsData = useCache<GetWorkoutsResponse>(workoutQueryKeys.all);
  const workoutFromList = workoutsData?.find(workout => workout.id === workoutId);
  console.log(workoutsData);
  return useSuspenseQuery({
    queryKey: workoutQueryKeys.detail(workoutId),
    queryFn: () => workoutService.getWorkoutById(workoutId),
    initialData: workoutFromList,
    staleTime: workoutFromList ? Infinity : 0,
  });
};
