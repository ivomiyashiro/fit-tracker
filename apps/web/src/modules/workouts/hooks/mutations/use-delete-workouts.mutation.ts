import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
    onError: error => toast.error(error.message || "Failed to delete workouts"),
  });
};
