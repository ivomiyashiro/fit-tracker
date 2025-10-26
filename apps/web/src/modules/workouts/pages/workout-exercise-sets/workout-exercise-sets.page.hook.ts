import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";

import {
  useWorkoutsQuery,
} from "@/web/modules/workouts/hooks/queries";

export const useWorkoutExerciseSets = () => {
  const { workoutId, workoutExerciseId } = useParams({
    from: "/_authenticated/workouts/$workoutId/we/$workoutExerciseId/sets/",
  });
  const navigate = useNavigate();

  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  const { data: workouts, isLoading: isWorkoutsLoading } = useWorkoutsQuery();
  const workout = workouts?.find(w => w.id === Number(workoutId));
  const exercise = workout?.workoutExercises.find(
    we => we.id === Number(workoutExerciseId),
  )?.exercise;

  const handleCreateDrawerClose = () => {
    setIsCreateDrawerOpen(false);
  };

  const handleCreateDrawerOpen = () => {
    setIsCreateDrawerOpen(true);
  };

  const handleBackNavigation = () => {
    navigate({
      to: "/workouts/$workoutId",
      params: { workoutId },
    });
  };

  return {
    // Data
    workout,
    exercise,
    workoutId: Number(workoutId),
    workoutExerciseId: Number(workoutExerciseId),

    // UI state
    isCreateDrawerOpen,
    isWorkoutsLoading,

    // Actions
    handleCreateDrawerClose,
    handleCreateDrawerOpen,
    handleBackNavigation,
  };
};
