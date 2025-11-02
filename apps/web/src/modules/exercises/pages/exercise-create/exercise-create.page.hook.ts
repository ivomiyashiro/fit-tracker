import type { MuscleGroup } from "@/web/modules/exercises/types";

import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useCreateExerciseMutation } from "@/web/modules/exercises/hooks/mutations/use-create-exercise.mutation";

export const useExerciseCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);

  const createMutation = useCreateExerciseMutation();

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleMuscleGroupsChange = (muscleGroups: MuscleGroup[]) => {
    setSelectedMuscleGroups(muscleGroups);
  };

  const handleCreate = () => {
    createMutation.mutate(
      {
        name,
        muscleGroupIds: selectedMuscleGroups.map(mg => mg.id),
      },
      {
        onSuccess: () => {
          navigate({ to: "/exercises" });
        },
      },
    );
  };

  const canSave = name.trim() !== "" && selectedMuscleGroups.length > 0;

  return {
    name,
    selectedMuscleGroups,
    isCreating: createMutation.isPending,
    canSave,
    handleNameChange,
    handleMuscleGroupsChange,
    handleCreate,
  };
};
