import type { GetWorkoutByIdResponse } from "@fit-tracker/api-client";

import { useState } from "react";

export const useWorkoutExercisesSelectionForm = () => {
  const [selectedExercises, setSelectedExercises] = useState<
    GetWorkoutByIdResponse["workoutExercises"][number]["exercise"][]
  >([]);
  const [selectionEnabled, setSelectionEnabled] = useState(false);

  const toggleSelectionEnabled = () => {
    setSelectionEnabled(prev => !prev);
  };

  const toggleSelection = (
    workoutExercise: GetWorkoutByIdResponse["workoutExercises"][number]["exercise"],
  ) => {
    setSelectedExercises(prev =>
      prev.includes(workoutExercise)
        ? prev.filter(e => e.id !== workoutExercise.id)
        : [...prev, workoutExercise],
    );
  };

  const clearSelection = () => {
    setSelectedExercises([]);
  };

  return {
    selectedExercises,
    selectionEnabled,
    toggleSelectionEnabled,
    toggleSelection,
    clearSelection,
  };
};
