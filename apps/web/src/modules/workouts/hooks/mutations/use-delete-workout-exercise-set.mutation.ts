import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workoutExerciseSetService } from "@/web/modules/workouts/services/workout-exercise-set.service";
import { workoutExerciseSetsQueryKeys } from "@/web/modules/workouts/utils";

export const useDeleteWorkoutExerciseSetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ setId }: { setId: number }) =>
      workoutExerciseSetService.deleteWorkoutExerciseSet(setId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutExerciseSetsQueryKeys.all,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete set");
    },
  });
};
