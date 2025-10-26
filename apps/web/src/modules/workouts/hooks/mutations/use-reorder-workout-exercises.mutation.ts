import type { Workout } from "@/web/modules/workouts/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workoutExerciseService } from "@/web/modules/workouts/services/workout-exercise.service";
import { workoutQueryKeys } from "@/web/modules/workouts/utils/workout-keys";

type ReorderWorkoutExercisesParams = {
  workoutId: number;
  workoutExerciseId: number;
  exercises: { id: number; order: number }[];
};

export const useReorderWorkoutExercisesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workoutExerciseId, exercises }: ReorderWorkoutExercisesParams) =>
      workoutExerciseService.reorderWorkoutExercises(workoutExerciseId, exercises),

    // Optimistic update: update the cache immediately before the API call
    onMutate: async ({ workoutId, exercises }) => {
      // Cancel any in-flight refetches to prevent them from overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: workoutQueryKeys.detail(workoutId) });

      // Save the previous state in case we need to rollback
      const previousWorkout = queryClient.getQueryData<Workout>(
        workoutQueryKeys.detail(workoutId),
      );

      // Optimistically update the cache
      queryClient.setQueryData<Workout>(
        workoutQueryKeys.detail(workoutId),
        (old) => {
          if (!old)
return old;

          // Create a map of id -> new order
          const orderMap = new Map(exercises.map(ex => [ex.id, ex.order]));

          // Update the order of each exercise
          const updatedExercises = old.workoutExercises.map(we => ({
            ...we,
            order: orderMap.get(we.id) ?? we.order,
          }));

          // Sort by the new order
          updatedExercises.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          return {
            ...old,
            workoutExercises: updatedExercises,
          };
        },
      );

      // Return context containing the previous state for rollback
      return { previousWorkout };
    },

    // If the mutation fails, rollback to the previous state
    onError: (error, variables, context) => {
      if (context?.previousWorkout) {
        queryClient.setQueryData(
          workoutQueryKeys.detail(variables.workoutId),
          context.previousWorkout,
        );
      }
      toast.error(error.message || "Failed to reorder workout exercises");
    },

    // On success, don't refetch immediately - the optimistic update already updated the UI
    // Only mark the query as stale so it will refresh on the next natural mount/refetch
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workoutQueryKeys.detail(variables.workoutId),
        refetchType: "none", // No refetch inmediato, solo marca como stale
      });
    },
  });
};
