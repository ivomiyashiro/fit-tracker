import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";

import type { Exercise } from "@/web/modules/workouts/types";

import { useUpdateWorkoutByIdMutation } from "@/web/modules/workouts/hooks/mutations";
import { useWorkoutByIdQuery } from "@/web/modules/workouts/hooks/queries";

export const useWorkoutAddExercise = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams({ from: "/_authenticated/workouts/$workoutId/we/$workoutExerciseId/add-exercises/" });

  const { data: workout, isSuccess } = useWorkoutByIdQuery(Number(workoutId));
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>(
    workout?.workoutExercises?.map(we => we.exercise) || [],
  );

  const { mutate: updateWorkout, isPending } = useUpdateWorkoutByIdMutation(Number(workoutId));

  const handleAddExercises = () => {
    if (!workout)
      return;

    updateWorkout({
      name: workout.name,
      exerciseIds: selectedExercises.map(e => e.id),
    }, {
      onSuccess: () => {
        navigate({ to: "/workouts/$workoutId", params: { workoutId: String(workoutId) } });
      },
    });
  };

  const handleBackNavigation = () => {
    navigate({ to: "/workouts/$workoutId", params: { workoutId: String(workoutId) } });
  };

  const handleSelectionChanged = (exercises: Exercise[]) => {
    setSelectedExercises(exercises);
  };

  return {
    // Data
    workoutId,
    isSuccess,

    // Selection state
    selectedExercises,
    handleSelectionChanged,

    // Actions
    handleAddExercises,
    handleBackNavigation,

    // UI state
    isPending,
  };
};
