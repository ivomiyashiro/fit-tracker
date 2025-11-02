import type { MuscleGroup } from "@/web/modules/exercises/types";

import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const useExerciseCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleMuscleGroupsChange = (muscleGroups: MuscleGroup[]) => {
    setSelectedMuscleGroups(muscleGroups);
  };

  const handleCreate = () => {
    // TODO: Implementar la lógica de creación cuando esté el backend
    setIsCreating(true);
    // eslint-disable-next-line no-console
    console.log("Creating exercise:", { name, muscleGroups: selectedMuscleGroups });

    // Simular creación exitosa y redirigir
    setTimeout(() => {
      setIsCreating(false);
      navigate({ to: "/exercises" });
    }, 1000);
  };

  const canSave = name.trim() !== "" && selectedMuscleGroups.length > 0;

  return {
    name,
    selectedMuscleGroups,
    isCreating,
    canSave,
    handleNameChange,
    handleMuscleGroupsChange,
    handleCreate,
  };
};
