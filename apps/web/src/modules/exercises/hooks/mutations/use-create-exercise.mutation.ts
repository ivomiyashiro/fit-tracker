import type { SingleExercise } from "@/web/modules/exercises/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { exercisesService } from "@/web/modules/exercises/services";

type CreateExerciseParams = {
  name: string;
  muscleGroupIds: number[];
};

export const useCreateExerciseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleExercise, Error, CreateExerciseParams>({
    mutationFn: data => exercisesService.createExercise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
};
