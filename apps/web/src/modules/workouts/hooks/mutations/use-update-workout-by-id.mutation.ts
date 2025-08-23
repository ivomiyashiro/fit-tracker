import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { UpdateWorkoutRequest } from "@/dtos/workouts/requests";

import { workoutService } from "@/web/modules/workouts/services";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";

export const useUpdateWorkoutByIdMutation = (workoutId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workout: UpdateWorkoutRequest) =>
      workoutService.updateWorkout(workoutId, workout),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutQueryKeys.detail(workoutId),
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update workout");
    },
  });
};
