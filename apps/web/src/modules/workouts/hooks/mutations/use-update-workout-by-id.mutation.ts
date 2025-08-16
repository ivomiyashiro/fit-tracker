

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { exercisesQueryKeys } from "@/web/modules/workouts/utils/exercises.query-keys";
import { workoutService } from "@/web/modules/workouts/services/workouts.service";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";
import { UpdateWorkoutRequest } from "@/dtos/workouts/requests";
import { Workout, Exercise } from "@/web/modules/workouts/types";

type UseUpdateWorkoutByIdMutationProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

export const useUpdateWorkoutByIdMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseUpdateWorkoutByIdMutationProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workoutId, workout }: { workoutId: number; workout: UpdateWorkoutRequest}) =>
      workoutService.updateWorkout(workoutId, workout),
    onMutate: async ({ workoutId, workout }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: workoutQueryKeys.all });
      await queryClient.cancelQueries({ queryKey: workoutQueryKeys.detail(workoutId) });

      // Snapshot the previous values
      const previousWorkouts = queryClient.getQueryData<Workout[]>(workoutQueryKeys.all);
      const previousWorkout = queryClient.getQueryData<Workout>(
        workoutQueryKeys.detail(workoutId),
      );

      // Get exercises from cache to include in optimistic workout
      const exercisesData = queryClient.getQueryData<Exercise[]>(
        exercisesQueryKeys.lists(),
      );

        const selectedExercises = workout.exerciseIds
        .map(id => exercisesData?.find(e => e.id === id))
        .filter(Boolean) as Exercise[];

      // Create optimistic update object
      const optimisticUpdate = {
        name: workout.name,
        workoutExercises: selectedExercises.map((exercise, index) => ({
          id: Date.now() + index, // Temporary ID for optimistic update
          exerciseId: exercise.id,
          exercise,
          sets: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      };

      // Force immediate update of the individual workout query
      if (previousWorkout) {
        queryClient.setQueryData<Workout>(workoutQueryKeys.detail(workoutId), {
          ...previousWorkout,
          ...optimisticUpdate,
        });
      }

      // Return a context object with the snapshotted values
      return { previousWorkouts, previousWorkout, workoutId };
    },
    onError: (error, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousWorkouts) {
        queryClient.setQueryData(workoutQueryKeys.all, context.previousWorkouts);
      }
      if (context?.previousWorkout && context?.workoutId) {
        queryClient.setQueryData(
          workoutQueryKeys.detail(context.workoutId),
          context.previousWorkout,
        );
      }
      onError?.(error);
      toast.error(error.message || "Failed to update workout");
    },
    onSuccess: (data, variables) => {
      // Update the cache with the actual server response
      queryClient.setQueryData<Workout[]>(workoutQueryKeys.all, (oldData) => {
        if (!oldData)
          return oldData;
        return oldData.map(workout =>
          workout.id === variables.workoutId
            ? {
                ...workout,
                ...data,
              }
            : workout,
        );
      });

      // Update individual workout query
      queryClient.setQueryData<Workout>(
        workoutQueryKeys.detail(variables.workoutId),
        (oldData) => {
          if (!oldData)
            return oldData;
          return {
            ...oldData,
            ...data,
          };
        },
      );

      onSuccess?.();
    },
    onSettled: () => {
      // Only invalidate if needed - optimistic updates should be sufficient
      // queryClient.invalidateQueries({ queryKey: workoutQueryKeys.all });
      onSettled?.();
    },
  });
};
