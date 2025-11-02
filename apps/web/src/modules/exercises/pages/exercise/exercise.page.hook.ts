import type { Exercise, MuscleGroup } from "@/web/modules/exercises/types";

import { useState } from "react";

type UseExerciseEditProps = {
  exercise?: Exercise;
};

export const useExerciseEdit = ({ exercise }: UseExerciseEditProps = {}) => {
  const [name, setName] = useState(exercise?.name || "");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>(
    exercise?.muscleGroups || [],
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleMuscleGroupsChange = (muscleGroups: MuscleGroup[]) => {
    setSelectedMuscleGroups(muscleGroups);
  };

  const handleSave = () => {
    // TODO: Implementar la lógica de guardado cuando esté el backend
    setIsEditing(true);
    // eslint-disable-next-line no-console
    console.log("Saving exercise:", { name, muscleGroups: selectedMuscleGroups });

    // Simular guardado exitoso
    setTimeout(() => {
      setIsEditing(false);
    }, 1000);
  };

  const canSave = name.trim() !== "" && selectedMuscleGroups.length > 0;

  return {
    name,
    selectedMuscleGroups,
    isEditing,
    canSave,
    handleNameChange,
    handleMuscleGroupsChange,
    handleSave,
  };
};
