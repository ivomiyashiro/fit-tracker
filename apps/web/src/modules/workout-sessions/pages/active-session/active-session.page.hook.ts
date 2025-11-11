import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useNavbarContext } from "@/web/components/ui/app-navbar/navbar-context";
import { useUpdateWorkoutSessionMutation, useWorkoutSessionQuery } from "@/web/modules/workout-sessions/hooks";

export const useActiveSession = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams({ strict: false });
  const { exerciseIndex = 0 } = useSearch({ strict: false });

  const { data: session, isLoading } = useWorkoutSessionQuery(Number(sessionId));
  const updateSessionMutation = useUpdateWorkoutSessionMutation();
  const { addSetHandlerRef } = useNavbarContext();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const currentExerciseIndex = exerciseIndex;
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
      to: "/todays-workout/session/$sessionId",
      params: { sessionId: String(sessionId) },
      search: { exerciseIndex: currentExerciseIndex - 1 },
    });
  };

  const handleNextExercise = () => {
    if (!canGoNext) {
      return;
    }

    navigate({
      to: "/todays-workout/session/$sessionId",
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

      navigate({
        to: "/workouts/session/$sessionId/summary",
        params: { sessionId: String(sessionId) },
      });
    }
    catch {
      toast.error("Failed to complete workout");
    }
  };

  const handleBack = () => {
    navigate({ to: "/workouts" });
  };

  const handleOpenDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  // Assign the add set handler to the ref
  useEffect(() => {
    addSetHandlerRef.current = handleOpenDrawer;
  }, [handleOpenDrawer, addSetHandlerRef]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      addSetHandlerRef.current = null;
    };
  }, [addSetHandlerRef]);

  return {
    session,
    currentExercise,
    currentExerciseIndex,
    totalExercises,
    canGoPrevious,
    canGoNext,
    isLastExercise,
    isLoading,
    isFinishingWorkout: updateSessionMutation.isPending,
    handlePreviousExercise,
    handleNextExercise,
    handleFinishWorkout,
    handleBack,
    isDrawerOpen,
    handleOpenDrawer,
    handleCloseDrawer,
  };
};
