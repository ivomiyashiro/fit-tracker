import { useSuspenseQuery } from "@tanstack/react-query";

import { workoutExerciseSetService } from "@/web/modules/workouts/services/workout-exercise-set.service";
import { workoutExerciseSetsQueryKeys } from "@/web/modules/workouts/utils";

export const useWorkoutExerciseSetByIdQuery = (setId: number) => {
  return useSuspenseQuery({
    queryKey: workoutExerciseSetsQueryKeys.detail(setId),
    queryFn: () => workoutExerciseSetService.getWorkoutExerciseSet(setId),
  });
};
