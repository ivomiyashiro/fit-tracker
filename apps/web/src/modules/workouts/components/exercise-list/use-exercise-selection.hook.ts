import { useState } from "react";

type UseExerciseSelectionProps = {
  selectedIds?: number[];
  onChange?: (selectedIds: number[]) => void;
};

export const useExerciseSelection = ({ 
  selectedIds = [], 
  onChange 
}: UseExerciseSelectionProps = {}) => {
  const [userSelections, setUserSelections] = useState<Set<number>>(new Set(selectedIds));

  const toggleSelection = (exerciseId: number) => {
    setUserSelections(prev => {
      console.log(prev)
      const newSelections = new Set(prev);
      console.log(newSelections)
      if (newSelections.has(exerciseId)) {
        newSelections.delete(exerciseId);
      } else {
        newSelections.add(exerciseId);
      }
      onChange?.(Array.from(newSelections));
      return newSelections;
    });
  };

  const hasSelection = selectedExerciseIds.length > 0;

  const clearSelection = () => {
    setUserSelections(new Set());
    onChange?.([]);
  };

  const setSelection = (ids: number[]) => {
    setUserSelections(new Set(ids));
    onChange?.(ids);
  };

  return {
    selectedExerciseIds: Array.from(userSelections),
    toggleSelection,
    hasSelection,
    clearSelection,
    setSelection,
  };
};