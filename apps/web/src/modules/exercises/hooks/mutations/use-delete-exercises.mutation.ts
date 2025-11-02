import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { exercisesService } from "@/web/modules/exercises/services/exercises.service";
import { exercisesQueryKeys } from "@/web/modules/exercises/utils";

export const useDeleteExercisesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: exercisesQueryKeys.all,
    mutationFn: (exerciseIds: number[]) => exercisesService.deleteExercises(exerciseIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exercisesQueryKeys.all });
      toast.success("Exercises deleted successfully");
    },
    onError: error => toast.error(error.message || "Failed to delete exercises"),
  });
};
