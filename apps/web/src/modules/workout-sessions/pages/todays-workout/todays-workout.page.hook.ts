import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { useNavbarContext } from "@/web/components/ui/app-navbar/navbar-context";
import { useActiveWorkoutSessionQuery, useCreateWorkoutSessionMutation, useNextWorkoutQuery } from "@/web/modules/workouts/hooks";

export const useTodaysWorkout = () => {
  const navigate = useNavigate();
  const { data: nextWorkout, isLoading: isLoadingNextWorkout } = useNextWorkoutQuery();
  const { data: activeSession, isLoading: isLoadingActiveSession } = useActiveWorkoutSessionQuery();
  const createSessionMutation = useCreateWorkoutSessionMutation();
  const { startWorkoutHandlerRef, setIsStartingWorkout, setIsLoadingWorkout } = useNavbarContext();

  const isLoading = isLoadingNextWorkout || isLoadingActiveSession;
  const hasActiveSession = !!activeSession;

  const handleStartWorkout = useCallback(async () => {
    // If there's an active session, resume it
    if (hasActiveSession && activeSession) {
      const exerciseIndex = activeSession.lastIncompleteExerciseIndex ?? 0;
      navigate({
        to: "/workout-sessions/$sessionId",
        params: { sessionId: String(activeSession.id) },
        search: { exerciseIndex },
      });
      return;
    }

    // Otherwise, create a new session
    if (!nextWorkout) {
      toast.error("No workout available");
      return;
    }

    try {
      const session = await createSessionMutation.mutateAsync({
        workoutId: nextWorkout.id,
      });

      navigate({
        to: "/workout-sessions/$sessionId",
        params: { sessionId: String(session.id) },
        search: { exerciseIndex: 0 },
      });
    }
    catch (error: any) {
      if (error?.message?.includes("active workout session")) {
        toast.error("You have an active workout session. Please complete it first.");
      }
      else {
        toast.error("Failed to start workout");
      }
    }
  }, [hasActiveSession, activeSession, nextWorkout, createSessionMutation, navigate]);

  const handleBack = () => {
    navigate({ to: "/workouts" });
  };

  // Assign the handler to the ref (no state update, no re-render)
  useEffect(() => {
    startWorkoutHandlerRef.current = handleStartWorkout;
  }, [handleStartWorkout, startWorkoutHandlerRef]);

  // Update the loading states
  useEffect(() => {
    setIsStartingWorkout(createSessionMutation.isPending);
  }, [createSessionMutation.isPending, setIsStartingWorkout]);

  useEffect(() => {
    setIsLoadingWorkout(isLoading);
  }, [isLoading, setIsLoadingWorkout]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      startWorkoutHandlerRef.current = null;
      setIsStartingWorkout(false);
      setIsLoadingWorkout(false);
    };
  }, [startWorkoutHandlerRef, setIsStartingWorkout, setIsLoadingWorkout]);

  return {
    nextWorkout,
    activeSession: hasActiveSession ? activeSession : null,
    isLoading,
    isStarting: createSessionMutation.isPending,
    handleStartWorkout,
    handleBack,
  };
};
