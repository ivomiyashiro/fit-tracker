import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workoutService } from "@/web/modules/workouts/services/workouts.service";
import { workoutQueryKeys } from "@/web/modules/workouts/utils/workout-keys";

export const useCreateWorkoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workoutService.createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutQueryKeys.lists() });
    },
    onError: error => toast.error(error.message || "Failed to create workout"),
  });
};
