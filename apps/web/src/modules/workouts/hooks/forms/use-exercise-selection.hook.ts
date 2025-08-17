import { useState } from "react";

type UseExerciseSelectionProps = {
  initialIds?: number[];
  onChange?: (selectedIds: number[]) => void;
};

export const useExerciseSelection = ({ 
  initialIds = [], 
  onChange 
}: UseExerciseSelectionProps = {}) => {
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>(initialIds);

  const toggleSelection = (exerciseId: number) => {
    setSelectedExerciseIds((prev) => {
      const newIds = prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId];
      
      onChange?.(newIds);
      return newIds;
    });
  };

  const hasSelection = selectedExerciseIds.length > 0;

  const clearSelection = () => {
    setSelectedExerciseIds([]);
    onChange?.([]);
  };

  const setSelection = (ids: number[]) => {
    setSelectedExerciseIds(ids);
    onChange?.(ids);
  };

  return {
    selectedExerciseIds,
    toggleSelection,
    hasSelection,
    clearSelection,
    setSelection,
  };
};