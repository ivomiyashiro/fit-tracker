import type { InfiniteData } from "@tanstack/react-query";
import type { CreateSetRequest } from "@/dtos/sets/requests";
import type { SetPaginatedResponse } from "@/dtos/sets/responses";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { workoutExerciseSetService } from "@/web/modules/workouts/services/workout-exercise-set.service";
import { workoutExerciseSetsQueryKeys } from "@/web/modules/workouts/utils";

export const useCreateWorkoutExerciseSetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workoutExerciseSet: CreateSetRequest) =>
      workoutExerciseSetService.createWorkoutExerciseSet(workoutExerciseSet),
    onMutate: async (newSet) => {
      const queryKey = workoutExerciseSetsQueryKeys.infinite(newSet.workoutExerciseId, 10);

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousSets = queryClient.getQueryData<InfiniteData<SetPaginatedResponse>>(queryKey);

      // Optimistically update to the new value
      if (previousSets) {
        queryClient.setQueryData<InfiniteData<SetPaginatedResponse>>(queryKey, (old) => {
          if (!old)
return old;

          // Create optimistic set with temporary ID
          const optimisticSet = {
            id: Date.now(), // Temporary ID
            workoutExerciseId: newSet.workoutExerciseId,
            reps: newSet.reps,
            weight: newSet.weight,
            rir: newSet.rir ?? null,
            notes: newSet.notes ?? null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Add to the first page (most recent)
          const newPages = [...old.pages];
          if (newPages[0]) {
            newPages[0] = {
              ...newPages[0],
              data: [optimisticSet, ...newPages[0].data],
              pagination: {
                ...newPages[0].pagination,
                total: newPages[0].pagination.total + 1,
              },
            };
          }

          return {
            ...old,
            pages: newPages,
          };
        });
      }

      // Return a context object with the snapshotted value
      return { previousSets };
    },
    onError: (error, _newSet, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSets) {
        const queryKey = workoutExerciseSetsQueryKeys.infinite(_newSet.workoutExerciseId, 10);
        queryClient.setQueryData(queryKey, context.previousSets);
      }
      toast.error(error.message || "Failed to record set");
    },
    onSuccess: (data, variables) => {
      const queryKey = workoutExerciseSetsQueryKeys.infinite(variables.workoutExerciseId, 10);

      // Replace the optimistic set with the real one from the server
      queryClient.setQueryData<InfiniteData<SetPaginatedResponse>>(queryKey, (old) => {
        if (!old)
return old;

        const newPages = [...old.pages];
        if (newPages[0]) {
          // Replace the first item (optimistic) with the real one
          newPages[0] = {
            ...newPages[0],
            data: [data, ...newPages[0].data.slice(1)],
          };
        }

        return {
          ...old,
          pages: newPages,
        };
      });
    },
  });
};
