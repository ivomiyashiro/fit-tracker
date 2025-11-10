import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workoutSessionService } from "@/web/modules/workouts/services";
import { workoutQueryKeys } from "@/web/modules/workouts/utils";

type CreateWorkoutSessionParams = {
  workoutId: number;
  completedAt?: string;
  duration?: number;
  notes?: string;
};

export const useCreateWorkoutSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateWorkoutSessionParams) =>
      workoutSessionService.createWorkoutSession(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutQueryKeys.next(),
      });
      queryClient.invalidateQueries({
        queryKey: workoutQueryKeys.lists(),
      });
    },
    onError: () => {
      toast.error("Failed to complete workout");
    },
  });
};
