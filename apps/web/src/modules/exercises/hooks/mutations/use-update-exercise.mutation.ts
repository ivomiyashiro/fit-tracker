import type { SingleExercise } from "@/web/modules/exercises/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { exercisesService } from "@/web/modules/exercises/services";

type UpdateExerciseParams = {
  id: number;
  data: {
    name?: string;
    muscleGroupIds?: number[];
  };
};

export const useUpdateExerciseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleExercise, Error, UpdateExerciseParams>({
    mutationFn: ({ id, data }) => exercisesService.updateExercise(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.invalidateQueries({ queryKey: ["exercise", variables.id] });
    },
  });
};
