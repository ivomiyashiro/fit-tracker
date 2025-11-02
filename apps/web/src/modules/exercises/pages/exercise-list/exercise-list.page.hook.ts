import type { ItemClickEvent } from "@/web/components/ui/list/list.types";

import type { Exercise } from "@/web/modules/exercises/types";

import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useDeleteExercisesMutation } from "@/web/modules/exercises/hooks/mutations";

const useExercisesSelection = () => {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [selectionEnabled, setSelectionEnabled] = useState(false);

  const toggleSelectionEnabled = () => {
    setSelectionEnabled(prev => !prev);
    if (selectionEnabled) {
      setSelectedExercises([]);
    }
  };

  const setSelectedExercisesFromList = (exercises: Exercise[]) => {
    setSelectedExercises(exercises);
  };

  const clearSelection = () => {
    setSelectedExercises([]);
  };

  return {
    selectedExercises,
    selectionEnabled,
    toggleSelectionEnabled,
    setSelectedExercisesFromList,
    clearSelection,
  };
};

export const useExercisesList = () => {
  const {
    selectionEnabled,
    toggleSelectionEnabled,
    selectedExercises,
    setSelectedExercisesFromList,
    clearSelection,
  } = useExercisesSelection();
  const navigate = useNavigate();
  const { mutate: deleteExercises, isPending: isDeletingExercises } = useDeleteExercisesMutation();

  const handleAddNewExercise = () => {
    navigate({
      to: "/exercises/create",
    });
  };

  const handleItemClick = (e: ItemClickEvent<Exercise>) => {
    navigate({
      to: "/exercises/$exerciseId",
      params: { exerciseId: String(e.item.id) },
    });
  };

  const handleDeleteExercises = () => {
    deleteExercises(selectedExercises.map(e => e.id), {
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
    selectedExercises,
    setSelectedExercisesFromList,

    // Actions
    handleDeleteExercises,
    handleItemClick,
    handleAddNewExercise,
    isDeletingExercises,
  };
};
