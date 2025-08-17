import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";

import { useDeleteWorkoutExerciseMutation } from "@/web/modules/workouts/hooks/mutations/use-delete-workout-exercise.mutation";
import { useWorkoutsQuery } from "@/web/modules/workouts/hooks/queries";

const useWorkoutExercisesSelection = () => {
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
  const [selectionEnabled, setSelectionEnabled] = useState(false);

  const toggleSelectionEnabled = () => {
    setSelectionEnabled(prev => !prev);
  };

  const toggleSelection = (weId: number) => {
    setSelectedExerciseIds(prev =>
      prev.includes(weId)
        ? prev.filter(e => e !== weId)
        : [...prev, weId],
    );
  };

  const clearSelection = () => {
    setSelectedExerciseIds([]);
  };

  return {
    selectedExerciseIds,
    selectionEnabled,
    toggleSelectionEnabled,
    toggleSelection,
    clearSelection,
  };
};

export const useWorkout = () => {
  const { workoutId } = useParams({ from: "/_authenticated/workouts/$workoutId/" });
  const navigate = useNavigate();

  const { mutate: deleteWorkoutExercise } = useDeleteWorkoutExerciseMutation();
  const { data: workouts } = useWorkoutsQuery();

  const workout = workouts?.find(w => w.id === Number(workoutId));

  const {
    selectionEnabled,
    toggleSelectionEnabled,
    selectedExerciseIds,
    toggleSelection,
    clearSelection,
  } = useWorkoutExercisesSelection();

  const handleDeleteWorkoutExercise = () => {
    deleteWorkoutExercise(selectedExerciseIds);
    clearSelection();
    toggleSelectionEnabled();
  };

  const handleBackNavigation = () => {
    navigate({ to: "/workouts" });
  };

  return {
    // Data
    workout,
    workoutId,

    // Selection state
    selectionEnabled,
    toggleSelectionEnabled,
    selectedExerciseIds,
    toggleSelection,

    // Actions
    handleDeleteWorkoutExercise,
    handleBackNavigation,
  };
};
