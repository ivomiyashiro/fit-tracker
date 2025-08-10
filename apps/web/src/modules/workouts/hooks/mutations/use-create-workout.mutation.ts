import type { CreateWorkoutRequest, GetExercisesResponse, GetWorkoutsResponse } from "@fit-tracker/api-client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { exercisesQueryKeys } from "@/web/modules/exercises/exercises.query-keys";
import { workoutService } from "@/web/modules/workouts/api";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";

// Track pending create operations to handle race conditions
const pendingCreateOperations = new Map<number, { cancelled: boolean }>();

type UseCreateWorkoutMutationProps = {
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

export const useCreateWorkoutMutation = ({
  onError,
  onSettled,
}: UseCreateWorkoutMutationProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [workoutQueryKeys.all],
    mutationFn: workoutService.createWorkout,
    onMutate: async (newWorkout: CreateWorkoutRequest) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: workoutQueryKeys.all });

      // Snapshot the previous value
      const previousWorkouts = queryClient.getQueryData<GetWorkoutsResponse>(workoutQueryKeys.all);

      // Get exercises from cache to include in optimistic workout
      const exercisesData = queryClient.getQueryData<GetExercisesResponse>(
        exercisesQueryKeys.lists(),
      );
      const selectedExercises
        = exercisesData
          ?.filter(exercise => newWorkout.exerciseIds.includes(exercise.id))
          .map(exercise => ({
            id: exercise.id,
            name: exercise.name,
            muscleGroups: exercise.muscleGroups,
          })) || [];

      // Create optimistic workout with temporary ID
      const optimisticId = Math.random();
      const optimisticWorkout = {
        id: optimisticId, // Temporary ID, will be replaced with actual ID from server
        name: newWorkout.name,
        workoutExercises: selectedExercises.map(exercise => ({
          id: exercise.id,
          exercise,
          sets: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      };

      // Track this pending operation
      pendingCreateOperations.set(optimisticId, { cancelled: false });

      // Optimistically update to the new value
      if (previousWorkouts) {
        queryClient.setQueryData<GetWorkoutsResponse>(workoutQueryKeys.all, [
          ...previousWorkouts,
          optimisticWorkout,
        ]);
      }

      // Return a context object with the snapshotted value and optimistic ID
      return { previousWorkouts, optimisticId };
    },
    onError: (error, _newWorkout, context) => {
      // Clean up pending operation
      if (context?.optimisticId) {
        pendingCreateOperations.delete(context.optimisticId);
      }

      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousWorkouts) {
        queryClient.setQueryData(workoutQueryKeys.all, context.previousWorkouts);
      }
      onError?.(error);
    },
    onSuccess: (data, _variables, context) => {
      if (!context?.optimisticId)
        return;

      // Check if this operation was cancelled (e.g., user deleted the optimistic workout)
      const pendingOp = pendingCreateOperations.get(context.optimisticId);

      if (pendingOp?.cancelled) {
        // Operation was cancelled, clean up and don't update the cache
        pendingCreateOperations.delete(context.optimisticId);
        return;
      }

      // Update the optimistic workout with the real ID from server response
      queryClient.setQueryData<GetWorkoutsResponse>(workoutQueryKeys.all, (oldData) => {
        if (!oldData)
          return oldData;

        return oldData.map(workout => (workout.id === context.optimisticId ? data : workout));
      });

      // Clean up pending operation
      pendingCreateOperations.delete(context.optimisticId);
    },
    onSettled() {
      onSettled?.();
    },
  });
};

// Export function to cancel pending create operations (used by delete mutation)
export const cancelPendingCreateOperation = (optimisticId: number) => {
  const pendingOp = pendingCreateOperations.get(optimisticId);
  if (pendingOp) {
    pendingOp.cancelled = true;
  }
};
