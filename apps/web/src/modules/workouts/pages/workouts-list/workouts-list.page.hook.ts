import type { Workout } from "@/web/modules/workouts/types";

import { useState } from "react";

import { useDeleteWorkoutMutation } from "@/web/modules/workouts/hooks/mutations";
import { useWorkoutsQuery } from "@/web/modules/workouts/hooks/queries";

const useWorkoutsSelection = () => {
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workout[]>([]);
  const [selectionEnabled, setSelectionEnabled] = useState(false);

  const toggleSelectionEnabled = () => {
    setSelectionEnabled(prev => !prev);
    if (selectionEnabled) {
      setSelectedWorkouts([]);
    }
  };

  const toggleSelection = (workout: Workout) => {
    setSelectedWorkouts(prev =>
      prev.includes(workout) ? prev.filter(w => w.id !== workout.id) : [...prev, workout],
    );
  };

  const setSelectedWorkoutsFromList = (workouts: Workout[]) => {
    setSelectedWorkouts(workouts);
  };

  const clearSelection = () => {
    setSelectedWorkouts([]);
  };

  return {
    selectedWorkouts,
    selectionEnabled,
    toggleSelectionEnabled,
    toggleSelection,
    setSelectedWorkoutsFromList,
    clearSelection,
  };
};

export const useWorkoutsList = () => {
  const {
    selectionEnabled,
    toggleSelectionEnabled,
    selectedWorkouts,
    setSelectedWorkoutsFromList,
    clearSelection,
  } = useWorkoutsSelection();

  const { mutate: deleteWorkouts, isPending: isDeletingWorkouts } = useDeleteWorkoutMutation();
  const { data: workouts, isLoading, isRefetching } = useWorkoutsQuery();

  const handleDeleteWorkouts = () => {
    deleteWorkouts(selectedWorkouts.map(w => w.id), {
      onSuccess: () => {
        clearSelection();
        toggleSelectionEnabled();
      },
    });
  };

  return {
    // Selection state
    selectionEnabled,
    toggleSelectionEnabled,
    selectedWorkouts,
    setSelectedWorkoutsFromList,

    // Actions
    handleDeleteWorkouts,

    // Data
    isDeletingWorkouts,
    isLoading: isLoading || isRefetching,
    workouts: workouts ?? [],
  };
};
