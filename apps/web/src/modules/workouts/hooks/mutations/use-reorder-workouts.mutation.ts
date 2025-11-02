import type { Workout } from "@/web/modules/workouts/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workoutService } from "@/web/modules/workouts/services";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";

type ReorderWorkoutsParams = {
  workouts: Array<{ id: number; order: number }>;
};

export const useReorderWorkoutsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workouts }: ReorderWorkoutsParams) =>
      workoutService.reorderWorkouts(workouts),

    // Optimistic update: update the cache immediately before the API call
    onMutate: async ({ workouts }) => {
      // Cancel any in-flight refetches to prevent them from overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: workoutQueryKeys.lists() });

      // Save the previous state in case we need to rollback
      const previousWorkouts = queryClient.getQueryData<Workout[]>(
        workoutQueryKeys.lists(),
      );

      // Optimistically update the cache
      queryClient.setQueryData<Workout[]>(
        workoutQueryKeys.lists(),
        (old) => {
          if (!old)
            return old;

          // Create a map of id -> new order
          const orderMap = new Map(workouts.map(w => [w.id, w.order]));

          // Update the order of each workout
          const updatedWorkouts = old.map(workout => ({
            ...workout,
            order: orderMap.get(workout.id) ?? workout.order,
          }));

          // Sort by the new order
          updatedWorkouts.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          return updatedWorkouts;
        },
      );

      // Return context containing the previous state for rollback
      return { previousWorkouts };
    },

    // If the mutation fails, rollback to the previous state
    onError: (error, _variables, context) => {
      if (context?.previousWorkouts) {
        queryClient.setQueryData(
          workoutQueryKeys.lists(),
          context.previousWorkouts,
        );
      }
      toast.error(error.message || "Failed to reorder workouts");
    },

    // On success, don't refetch immediately - the optimistic update already updated the UI
    // Only mark the query as stale so it will refresh on the next natural mount/refetch
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutQueryKeys.lists(),
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: workoutQueryKeys.next(),
        refetchType: "none",
      });
    },
  });
};
