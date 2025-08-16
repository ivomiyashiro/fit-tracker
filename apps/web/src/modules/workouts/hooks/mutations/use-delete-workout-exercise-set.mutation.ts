
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workoutService } from "@/web/modules/workouts/services/workouts.service";
import { WorkoutExerciseSet } from "@/web/modules/workouts/types";
import { workoutExerciseSetsQueryKeys } from "@/web/modules/workouts/utils";

export const useDeleteWorkoutExerciseSetMutation = (
  {
    workoutId,
    workoutExerciseId,
    onSuccess,
    onError,
  }: {
    workoutId: number;
    workoutExerciseId: number;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  } = {} as {
    workoutId: number;
    workoutExerciseId: number;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  },
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ setId }: { setId: number }) =>
      workoutService.deleteWorkoutExerciseSet(workoutId, workoutExerciseId, setId),
    onMutate: async ({ setId }: { setId: number }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      const queryKey = workoutExerciseSetsQueryKeys.list(workoutId, workoutExerciseId);
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousSets = queryClient.getQueryData<WorkoutExerciseSet[]>(queryKey);

      // Optimistically remove the set
      if (previousSets) {
        const updatedSets = {
          ...previousSets,
          data: previousSets.data.filter(set => set.id !== setId),
        };
        queryClient.setQueryData<WorkoutExerciseSet[]>(queryKey, updatedSets);
      }

      // Return a context object with the snapshotted value
      return { previousSets, queryKey };
    },
    onError: (error, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSets && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousSets);
      }
      onError?.(error);
      toast.error(error.message || "Failed to delete set");
    },
    onSuccess: () => {
      onSuccess?.();
      // Invalidate and refetch to ensure consistency with server
      const queryKey = workoutExerciseSetsQueryKeys.list(workoutId, workoutExerciseId);
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
