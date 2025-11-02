import type { InfiniteData, QueryKey } from "@tanstack/react-query";

import type { ExerciseResponse } from "@/dtos/exercises/responses";
import type { Exercise, MuscleGroup, SingleExercise } from "@/web/modules/exercises/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { exercisesService, muscleGroupsService } from "@/web/modules/exercises/services";
import { exercisesQueryKeys } from "@/web/modules/exercises/utils";

type CreateExerciseParams = {
  name: string;
  muscleGroupIds: number[];
};

type MutationContext = {
  previousExercises: Array<[QueryKey, InfiniteData<ExerciseResponse> | undefined]>;
};

export const useCreateExerciseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleExercise, Error, CreateExerciseParams, MutationContext>({
    mutationFn: data => exercisesService.createExercise(data),

    onMutate: async (newExerciseData) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: exercisesQueryKeys.lists() });

      // Get muscle groups from cache or fetch them
      const muscleGroups = queryClient.getQueryData<MuscleGroup[]>(["muscle-groups"])
        || await muscleGroupsService.getMuscleGroups();

      // Create optimistic exercise
      const optimisticExercise: Exercise = {
        id: Date.now(), // temporary ID
        name: newExerciseData.name,
        muscleGroups: muscleGroups
          .filter(mg => newExerciseData.muscleGroupIds.includes(mg.id))
          .map(mg => ({ id: mg.id, name: mg.name })),
      };

      // Snapshot the previous value
      const previousExercises = queryClient.getQueriesData<InfiniteData<ExerciseResponse>>({
        queryKey: exercisesQueryKeys.lists(),
      });

      // Optimistically update all exercise list queries
      queryClient.setQueriesData<InfiniteData<ExerciseResponse>>(
        { queryKey: exercisesQueryKeys.lists() },
        (old) => {
          if (!old) {
            return old;
          }

          // Find the correct position for the new exercise (alphabetically, case-insensitive)
          const firstPageData = old.pages[0]?.data || [];
          const insertIndex = firstPageData.findIndex(
            ex => ex.name.toLowerCase() > optimisticExercise.name.toLowerCase(),
          );

          // If insertIndex is -1, it means the new exercise should go at the end
          const finalIndex = insertIndex === -1 ? firstPageData.length : insertIndex;

          // Create new data array with exercise inserted at correct position
          const newFirstPageData = [
            ...firstPageData.slice(0, finalIndex),
            optimisticExercise,
            ...firstPageData.slice(finalIndex),
          ];

          // Add the new exercise to the first page at the correct position
          return {
            ...old,
            pages: old.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  data: newFirstPageData,
                  pagination: {
                    ...page.pagination,
                    total: page.pagination.total + 1,
                    totalPages: Math.ceil((page.pagination.total + 1) / page.pagination.limit),
                  },
                };
              }
              return page;
            }),
          };
        },
      );

      // Return context with snapshot for rollback
      return { previousExercises };
    },

    onError: (error, _newExercise, context) => {
      // Rollback to previous state on error
      if (context?.previousExercises) {
        context.previousExercises.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Show error toast
      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to create exercise";
      toast.error(errorMessage);
    },

    onSuccess: () => {
      // Refetch to get the real data from server (with correct ID and sorting)
      queryClient.invalidateQueries({ queryKey: exercisesQueryKeys.lists() });
    },
  });
};
