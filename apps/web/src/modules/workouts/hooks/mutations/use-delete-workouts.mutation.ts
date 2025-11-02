import { useMutation, useQueryClient } from "@tanstack/react-query";

import { workoutService } from "@/web/modules/workouts/services/workouts.service";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";

export const useDeleteWorkoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: workoutQueryKeys.all,
    mutationFn: (workoutIds: number[]) => workoutService.deleteWorkouts(workoutIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutQueryKeys.all });
    },
  });
};
