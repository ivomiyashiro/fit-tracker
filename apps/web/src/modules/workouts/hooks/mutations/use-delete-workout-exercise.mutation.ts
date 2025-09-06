import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workoutExerciseService } from "@/web/modules/workouts/services/workout-exercise.service";
import { workoutQueryKeys } from "@/web/modules/workouts/utils/workout-keys";

export const useDeleteWorkoutExerciseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workoutExerciseService.deleteWorkoutExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutQueryKeys.lists() });
    },
    onError: error => toast.error(error.message || "Failed to delete workout exercise"),
  });
};
