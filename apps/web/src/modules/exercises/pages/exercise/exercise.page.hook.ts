import type { MuscleGroup } from "@/web/modules/exercises/types";

import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useDeleteExercisesMutation, useUpdateExerciseMutation } from "@/web/modules/exercises/hooks/mutations";
import { useExerciseQuery } from "@/web/modules/exercises/hooks/queries/use-exercise.query";

type UseExerciseEditProps = {
  exerciseId: number;
};

export const useExerciseEdit = ({ exerciseId }: UseExerciseEditProps) => {
  const navigate = useNavigate();
  const { data: exercise, isLoading } = useExerciseQuery(exerciseId);
  const updateMutation = useUpdateExerciseMutation();
  const deleteMutation = useDeleteExercisesMutation();

  const [name, setName] = useState("");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);

  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setSelectedMuscleGroups(exercise.muscleGroups);
    }
  }, [exercise]);

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleMuscleGroupsChange = (muscleGroups: MuscleGroup[]) => {
    setSelectedMuscleGroups(muscleGroups);
  };

  const handleSave = () => {
    updateMutation.mutate({
      id: exerciseId,
      data: {
        name,
        muscleGroupIds: selectedMuscleGroups.map(mg => mg.id),
      },
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate([exerciseId], {
      onSuccess: () => {
        navigate({ to: "/exercises" });
      },
    });
  };

  const canSave = name.trim() !== "" && selectedMuscleGroups.length > 0;

  return {
    name,
    selectedMuscleGroups,
    isLoading,
    isEditing: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    canSave,
    handleNameChange,
    handleMuscleGroupsChange,
    handleSave,
    handleDelete,
  };
};
