import type { CreateWorkoutExerciseSetRequest, GetWorkoutExerciseSetsResponse } from "@fit-tracker/api-client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workoutService } from "@/web/modules/workouts/api";
import { workoutExerciseSetsQueryKeys } from "@/web/modules/workouts/utils";

export const useCreateWorkoutExerciseSetMutation = ({
  workoutId,
  workoutExerciseId,
}: {
  workoutId: number;
  workoutExerciseId: number;
}) => {
  const queryClient = useQueryClient();
  const queryKey = workoutExerciseSetsQueryKeys.list(workoutId, workoutExerciseId);

  return useMutation({
    mutationFn: (set: CreateWorkoutExerciseSetRequest) =>
      workoutService.createWorkoutExerciseSet(workoutId, workoutExerciseId, set),
    onMutate: async (newSet: CreateWorkoutExerciseSetRequest) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousSets = queryClient.getQueryData<GetWorkoutExerciseSetsResponse>(queryKey);

      // Create optimistic set with temporary ID
      const optimisticId = Math.random();
      const optimisticSet = {
        id: optimisticId, // Temporary ID, will be replaced with actual ID from server
        reps: newSet.reps,
        weight: newSet.weight,
        rir: newSet.rir ?? 0,
        rpe: newSet.rpe ?? 0,
        notes: newSet.notes ?? "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically update to the new value
      if (previousSets) {
        queryClient.setQueryData<GetWorkoutExerciseSetsResponse>(queryKey, {
          ...previousSets,
          data: [optimisticSet, ...previousSets.data],
        });
      }

      // Return a context object with the snapshotted value and optimistic ID
      return { previousSets, optimisticId };
    },
    onError: (error, _newSet, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSets) {
        queryClient.setQueryData(queryKey, context.previousSets);
      }
      toast.error(error.message || "Failed to create workout exercise set");
    },
    onSuccess: (data, _variables, context) => {
      if (!context?.optimisticId)
        return;

      // Update the optimistic set with the real ID from server response
      queryClient.setQueryData<GetWorkoutExerciseSetsResponse>(queryKey, (oldData) => {
        if (!oldData)
          return oldData;

        return {
          ...oldData,
          data: oldData.data.map(set =>
            set.id === context.optimisticId ? { ...set, id: data.id } : set,
          ),
        };
      });
    },
  });
};
