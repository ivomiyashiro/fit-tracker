import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workoutService } from "@/web/modules/workouts/services/workouts.service";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";
import { UpdateWorkoutRequest } from "@/dtos/workouts/requests";

export const useUpdateWorkoutMutation = ({
  workoutId,
}: {
  workoutId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workout: UpdateWorkoutRequest) =>
      workoutService.updateWorkout(workoutId, workout),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutQueryKeys.detail(workoutId),
      });
    },
    onError: error => {
      toast.error(error.message || "Failed to update workout");
    },
  });
};
