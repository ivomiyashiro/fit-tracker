import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

import { useUpdateWorkoutSessionMutation, useWorkoutSessionQuery } from "@/web/modules/todays-workout/hooks";

export const useActiveSession = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams({ strict: false });
  const { exerciseIndex = 0 } = useSearch({ strict: false });

  const { data: session, isLoading } = useWorkoutSessionQuery(Number(sessionId));
  const updateSessionMutation = useUpdateWorkoutSessionMutation();

  const currentExerciseIndex = Number(exerciseIndex);
  const currentExercise = session?.workout?.workoutExercises?.[currentExerciseIndex];
  const totalExercises = session?.workout?.workoutExercises?.length ?? 0;

  const canGoPrevious = currentExerciseIndex > 0;
  const canGoNext = currentExerciseIndex < totalExercises - 1;
  const isLastExercise = currentExerciseIndex === totalExercises - 1;

  // Track session duration
  useEffect(() => {
    if (!session?.createdAt) {
      return;
    }

    const startTime = new Date(session.createdAt).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const duration = Math.floor((now - startTime) / 1000);

      updateSessionMutation.mutate({
        sessionId: Number(sessionId),
        data: { duration },
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [session?.createdAt, sessionId, updateSessionMutation]);

  const handlePreviousExercise = () => {
    if (!canGoPrevious) {
      return;
    }

    navigate({
      to: "/workouts/session/$sessionId",
      params: { sessionId: String(sessionId) },
      search: { exerciseIndex: currentExerciseIndex - 1 },
    });
  };

  const handleNextExercise = () => {
    if (!canGoNext) {
      return;
    }

    navigate({
      to: "/workouts/session/$sessionId",
      params: { sessionId: String(sessionId) },
      search: { exerciseIndex: currentExerciseIndex + 1 },
    });
  };

  const handleFinishWorkout = async () => {
    try {
      await updateSessionMutation.mutateAsync({
        sessionId: Number(sessionId),
        data: {
          completedAt: new Date().toISOString(),
        },
      });

      toast.success("Workout completed!");

      navigate({
        to: "/workouts/session/$sessionId/summary",
        params: { sessionId: String(sessionId) },
      });
    }
    catch (error) {
      console.error("Failed to complete workout:", error);
      toast.error("Failed to complete workout");
    }
  };

  const handleBack = () => {
    navigate({ to: "/workouts" });
  };

  return {
    session,
    currentExercise,
    currentExerciseIndex,
    totalExercises,
    canGoPrevious,
    canGoNext,
    isLastExercise,
    isLoading,
    handlePreviousExercise,
    handleNextExercise,
    handleFinishWorkout,
    handleBack,
  };
};
