import { useParams, useNavigate } from "@tanstack/react-router";
import { useWorkoutsQuery } from "@/web/modules/workouts/hooks/queries";
import { useDeleteWorkoutExerciseMutation } from "@/web/modules/workouts/hooks/mutations/use-delete-workout-exercise.mutation";
import { useState } from "react";

const useWorkoutExercisesSelectionForm = () => {
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
  const [selectionEnabled, setSelectionEnabled] = useState(false);

  const toggleSelectionEnabled = () => {
    setSelectionEnabled(prev => !prev);
  };

  const toggleSelection = (exerciseId: number) => {
    setSelectedExerciseIds(prev =>
      prev.includes(exerciseId)
        ? prev.filter(e => e !== exerciseId)
        : [...prev, exerciseId],
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
  const { workoutId } = useParams({ from: "/workouts/$workoutId/" });
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
  } = useWorkoutExercisesSelectionForm();

  const handleDeleteWorkoutExercise = () => {
    deleteWorkoutExercise(selectedExerciseIds);
    clearSelection();
    toggleSelectionEnabled();
  };

  const handleBackNavigation = () => {
    navigate({ to: "/workouts" });
  };

  const selectedWorkoutExercises = workout?.workoutExercises.filter(we => 
    selectedExerciseIds.includes(we.exercise.id)
  ) || [];

  return {
    // Data
    workout,
    workoutId,
    
    // Selection state
    selectionEnabled,
    toggleSelectionEnabled,
    selectedExerciseIds,
    toggleSelection,
    selectedWorkoutExercises,
    
    // Actions
    handleDeleteWorkoutExercise,
    handleBackNavigation,
  };
};
