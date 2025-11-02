import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workoutSessionService } from "@/web/modules/workouts/services/workout-session.service";
import { workoutQueryKeys, workoutSessionKeys } from "@/web/modules/workouts/utils";

type UpdateWorkoutSessionParams = {
  sessionId: number;
  data: {
    completedAt?: string;
    duration?: number;
    notes?: string;
  };
};

export const useUpdateWorkoutSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }: UpdateWorkoutSessionParams) =>
      workoutSessionService.updateWorkoutSession(sessionId, data),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: workoutSessionKeys.detail(sessionId),
      });
      queryClient.invalidateQueries({
        queryKey: workoutSessionKeys.summary(sessionId),
      });
      queryClient.invalidateQueries({
        queryKey: workoutQueryKeys.next(),
      });
      queryClient.invalidateQueries({
        queryKey: workoutSessionKeys.active(),
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update workout session");
    },
  });
};
