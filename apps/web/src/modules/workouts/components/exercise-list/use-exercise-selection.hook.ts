import { useCallback, useState } from "react";

type UseExerciseSelectionProps = {
  selectedIds?: number[];
};

export const useExerciseSelection = ({ selectedIds = [] }: UseExerciseSelectionProps = {}) => {
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>(selectedIds);

  const toggleSelection = useCallback((exerciseId: number) => {
    setSelectedExerciseIds((prev) => {
      if (prev.includes(exerciseId)) {
        // Remove from selection
        return prev.filter(id => id !== exerciseId);
      }
      else {
        // Add to selection
        return [...prev, exerciseId];
      }
    });
  }, []);

  const selectExercise = useCallback((exerciseId: number) => {
    setSelectedExerciseIds((prev) => {
      if (!prev.includes(exerciseId)) {
        return [...prev, exerciseId];
      }
      return prev;
    });
  }, []);

  const deselectExercise = useCallback((exerciseId: number) => {
    setSelectedExerciseIds(prev => prev.filter(id => id !== exerciseId));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedExerciseIds([]);
  }, []);

  const isSelected = useCallback((exerciseId: number) => {
    return selectedExerciseIds.includes(exerciseId);
  }, [selectedExerciseIds]);

  return {
    selectedExerciseIds,
    toggleSelection,
    selectExercise,
    deselectExercise,
    clearSelection,
    isSelected,
  };
};
