import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Workout } from "@/web/modules/workouts/types";

import { workoutService } from "@/web/modules/workouts/services/workouts.service";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";

export const useDeleteWorkoutByIdMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workoutId: number) => workoutService.deleteWorkouts([workoutId]),
    onMutate: async (workoutId: number) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: workoutQueryKeys.all });

      // Snapshot the previous value
      const previousWorkouts = queryClient.getQueryData<Workout[]>(workoutQueryKeys.all);

      // Optimistically remove the workout
      if (previousWorkouts) {
        const updatedWorkouts = previousWorkouts.filter(workout => workout.id !== workoutId);
        queryClient.setQueryData<Workout[]>(workoutQueryKeys.all, updatedWorkouts);
      }

      // Return a context object with the snapshotted value
      return { previousWorkouts };
    },
    onError: (error, _workoutId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousWorkouts) {
        queryClient.setQueryData(workoutQueryKeys.all, context.previousWorkouts);
      }
      onError?.(error);
      toast.error(error.message || "Failed to delete workout");
    },
    onSuccess: () => {
      onSuccess?.();
      // Invalidate and refetch to ensure consistency with server
      queryClient.invalidateQueries({ queryKey: workoutQueryKeys.all });
    },
  });
};
