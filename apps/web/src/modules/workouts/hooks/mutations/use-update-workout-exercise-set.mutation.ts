import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workoutService } from "@/web/modules/workouts/api";
import { workoutExerciseSetsQueryKeys } from "@/web/modules/workouts/utils";

export const useUpdateWorkoutExerciseSetMutation = ({
  workoutId,
  workoutExerciseId,
}: {
  workoutId: number;
  workoutExerciseId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ setId, set }: { setId: number; set: UpdateWorkoutExerciseSetRequest }) =>
      workoutService.updateWorkoutExerciseSet(workoutId, workoutExerciseId, setId, set),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutExerciseSetsQueryKeys.list(workoutId, workoutExerciseId),
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update workout exercise set");
    },
  });
};
