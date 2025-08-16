import { useSuspenseQuery } from "@tanstack/react-query";

import { useCache } from "@/web/hooks";
import { workoutService } from "@/web/modules/workouts/services/workouts.service";
import { workoutExerciseSetsQueryKeys } from "@/web/modules/workouts/utils";
import { WorkoutExerciseSet } from "@/web/modules/workouts/types";

export const useWorkoutExerciseSetsSuspenseQuery = ({
  workoutId,
  workoutExerciseId,
  pagination,
}: {
  workoutId: number;
  workoutExerciseId: number;
  pagination?: {
    cursor: number;
    limit: number;
  };
}) => {
  return useSuspenseQuery({
    queryKey: ["workout-exercise-sets", workoutId, workoutExerciseId, pagination],
    queryFn: () => workoutService.getWorkoutExerciseSets(workoutId, workoutExerciseId, pagination),
  });
};

export const useCachedOrWorkoutExerciseSetsSuspenseQuery = ({
  workoutId,
  workoutExerciseId,
  pagination,
}: {
  workoutId: number;
  workoutExerciseId: number;
  pagination?: {
    cursor: number;
    limit: number;
  };
}) => {
  const queryKey = workoutExerciseSetsQueryKeys.list(workoutId, workoutExerciseId);
  const cachedData = useCache<WorkoutExerciseSet[]>(queryKey);

  return useSuspenseQuery({
    queryKey,
    queryFn: () => workoutService.getWorkoutExerciseSets(workoutId, workoutExerciseId, pagination),
    initialData: cachedData,
    staleTime: cachedData ? Infinity : 0,
  });
};
