import { useSuspenseQuery } from "@tanstack/react-query";

import { workoutExerciseSetService } from "@/web/modules/workouts/services/workout-exercise-set.service";

import { workoutExerciseSetsQueryKeys } from "../../utils";

export const useWorkoutExerciseSetsQuery = ({
  workoutExerciseId,
  pagination,
}: {
  workoutExerciseId: number;
  pagination?: {
    cursor: number;
    limit: number;
  };
}) => {
  return useSuspenseQuery({
    queryKey: workoutExerciseSetsQueryKeys.list(workoutExerciseId, pagination),
    queryFn: () => workoutExerciseSetService.getWorkoutExerciseSets(workoutExerciseId),
  });
};
