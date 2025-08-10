import type { GetWorkoutsResponse } from "@fit-tracker/api-client";

import { useState } from "react";

export const useWorkoutsSelectionForm = () => {
  const [selectedWorkouts, setSelectedWorkouts] = useState<GetWorkoutsResponse[number][]>([]);
  const [selectionEnabled, setSelectionEnabled] = useState(false);

  const toggleSelectionEnabled = () => {
    setSelectionEnabled(prev => !prev);
    if (selectionEnabled) {
      setSelectedWorkouts([]);
    }
  };

  const toggleSelection = (workout: GetWorkoutsResponse[number]) => {
    setSelectedWorkouts(prev =>
      prev.includes(workout) ? prev.filter(w => w.id !== workout.id) : [...prev, workout],
    );
  };

  const clearSelection = () => {
    setSelectedWorkouts([]);
  };

  return {
    selectedWorkouts,
    selectionEnabled,
    toggleSelectionEnabled,
    toggleSelection,
    clearSelection,
  };
};
