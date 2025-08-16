import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { CreateWorkoutRequest } from "@/dtos/workouts/requests";


import { createWorkoutSchema } from "@/dtos/workouts/requests";
import { useCreateWorkoutMutation } from "@/web/modules/workouts/hooks/mutations";

type UseWorkoutFormProps = {
  initialData?: {
    name?: string;
    exerciseIds?: number[];
  };
};

export const useWorkoutForm = ({ initialData }: UseWorkoutFormProps) => {
  const navigate = useNavigate();
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);

  const { mutate: createWorkout, isPending } = useCreateWorkoutMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateWorkoutRequest>({
    resolver: zodResolver(createWorkoutSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      exerciseIds: initialData?.exerciseIds || [],
    },
  });

  const toggleSelection = (exerciseId: number) => {
    setSelectedExerciseIds(prev => {
      const newIds = prev.includes(exerciseId)
        ? prev.filter(e => e !== exerciseId)
        : [...prev, exerciseId];

      setValue(
        "exerciseIds",
        newIds,
      );
      return newIds;
    });
  };

  const hasSelection = selectedExerciseIds.length > 0;

  const onSubmit = handleSubmit(data => {
    createWorkout({ ...data, exerciseIds: selectedExerciseIds }, {
      onSuccess: () => {
        navigate({ to: "/workouts" });
      },
    });
  });

  return {
    errors,
    isValid,
    register,
    onSubmit,
    setValue,
    selectedExerciseIds,
    toggleSelection,
    hasSelection,
    isPending,
  };
};
