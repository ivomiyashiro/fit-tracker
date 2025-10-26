import type { UpdateSetRequest } from "@/dtos/sets/requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { workoutExerciseSetService } from "@/web/modules/workouts/services/workout-exercise-set.service";
import { workoutExerciseSetsQueryKeys } from "@/web/modules/workouts/utils";

export const useUpdateWorkoutExerciseSetMutation = (setId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workoutExerciseSet: UpdateSetRequest) =>
      workoutExerciseSetService.updateWorkoutExerciseSet(setId, workoutExerciseSet),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutExerciseSetsQueryKeys.detail(setId),
      });
      queryClient.invalidateQueries({
        queryKey: workoutExerciseSetsQueryKeys.all,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update set");
    },
  });
};
