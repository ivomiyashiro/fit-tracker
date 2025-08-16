import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CreateSetRequest } from "@/dtos/sets/requests";
import type { SetResponse } from "@/dtos/sets/responses";

import { workoutService } from "@/web/modules/workouts/services/workouts.service";
import { workoutExerciseSetsQueryKeys } from "@/web/modules/workouts/utils";
import { WorkoutExerciseSet } from "../../types";

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
    mutationFn: (set: CreateSetRequest) =>
      workoutService.createWorkoutExerciseSet(workoutId, workoutExerciseId, set), 
    onMutate: async (newSet: CreateSetRequest) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousSets = queryClient.getQueryData<SetResponse[]>(queryKey);

      // Create optimistic set with temporary ID
      const optimisticId = Math.random();
      const optimisticSet = {
        id: optimisticId, // Temporary ID, will be replaced with actual ID from server
        workoutExerciseId,
        reps: newSet.reps,
        weight: newSet.weight,
        rir: newSet.rir ?? 0,
        notes: newSet.notes ?? "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically update to the new value
      if (previousSets) {
        queryClient.setQueryData<SetResponse[]>(queryKey, [optimisticSet, ...previousSets]);
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
      queryClient.setQueryData<WorkoutExerciseSet[]>(queryKey, (oldData) => {
        if (!oldData)
          return oldData;

        return {
          ...oldData,
          data: oldData.map(set =>
            set.id === context.optimisticId ? { ...set, id: data.id } : set,
          ),
        };
      });
    },
  });
};
