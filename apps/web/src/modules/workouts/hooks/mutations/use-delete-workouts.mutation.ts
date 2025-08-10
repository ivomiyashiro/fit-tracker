import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workoutService } from "@/web/modules/workouts/api";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";
import { separateRealAndTemporaryIds } from "@/web/utils";

import { cancelPendingCreateOperation } from "./use-create-workout.mutation";

export const useDeleteWorkoutMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workoutIds: number[]) => {
      const { realIds, temporaryIds } = separateRealAndTemporaryIds(workoutIds);

      // Cancel any pending create operations for temporary IDs
      temporaryIds.forEach((tempId) => {
        cancelPendingCreateOperation(tempId);
      });

      // Only call API for real IDs, temporary ones are handled optimistically
      if (realIds.length > 0) {
        await workoutService.deleteWorkouts({ workoutIds: realIds });
      }

      // Return info about what was processed
      return { realIds, temporaryIds };
    },
    onMutate: async (workoutIds: number[]) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: workoutQueryKeys.all });

      // Snapshot the previous value
      const previousWorkouts = queryClient.getQueryData<GetWorkoutsResponse>(workoutQueryKeys.all);

      // Optimistically remove ALL workouts (both real and temporary)
      if (previousWorkouts) {
        const updatedWorkouts = previousWorkouts.filter(
          workout => !workoutIds.includes(workout.id),
        );
        queryClient.setQueryData<GetWorkoutsResponse>(workoutQueryKeys.all, updatedWorkouts);
      }

      return { previousWorkouts };
    },
    onError: (error, _workoutIds, context) => {
      // Rollback on error
      if (context?.previousWorkouts) {
        queryClient.setQueryData(workoutQueryKeys.all, context.previousWorkouts);
      }
      onError?.(error);
      toast.error(error.message || "Failed to delete workouts");
    },
    onSuccess: ({ realIds }) => {
      // Only invalidate if we actually called the API (had real IDs)
      if (realIds.length > 0) {
        queryClient.invalidateQueries({ queryKey: workoutQueryKeys.all });
      }

      onSuccess?.();
    },
  });
};
