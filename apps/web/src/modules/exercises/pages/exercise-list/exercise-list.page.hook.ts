import type { Exercise } from "@/web/modules/exercises/types";

import { useState } from "react";

import { useDeleteExercisesMutation } from "@/web/modules/exercises/hooks/mutations";
import { useInfiniteExercisesQuery } from "@/web/modules/exercises/hooks/queries";

const useExercisesSelection = () => {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [selectionEnabled, setSelectionEnabled] = useState(false);

  const toggleSelectionEnabled = () => {
    setSelectionEnabled(prev => !prev);
    if (selectionEnabled) {
      setSelectedExercises([]);
    }
  };

  const toggleSelection = (exercise: Exercise) => {
    setSelectedExercises(prev =>
      prev.includes(exercise) ? prev.filter(e => e.id !== exercise.id) : [...prev, exercise],
    );
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
    toggleSelection,
    setSelectedExercisesFromList,
    clearSelection,
  };
};

export const useExercisesList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    selectionEnabled,
    toggleSelectionEnabled,
    selectedExercises,
    setSelectedExercisesFromList,
    clearSelection,
  } = useExercisesSelection();

  const { mutate: deleteExercises, isPending: isDeletingExercises } = useDeleteExercisesMutation();
  const { data, isSuccess, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteExercisesQuery(searchTerm);

  const exercises = data?.pages.flatMap(page => page.data) || [];

  const handleDeleteExercises = () => {
    deleteExercises(selectedExercises.map(e => e.id));
    clearSelection();
    toggleSelectionEnabled();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return {
    // Selection state
    selectionEnabled,
    toggleSelectionEnabled,
    selectedExercises,
    setSelectedExercisesFromList,

    // Search
    searchTerm,
    handleSearchChange,

    // Actions
    handleDeleteExercises,
    isDeletingExercises,

    // Data
    isSuccess,
    exercises,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
