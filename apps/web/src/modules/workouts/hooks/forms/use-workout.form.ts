import type { GetExercisesResponse } from "@fit-tracker/api-client";

import { createWorkoutSchema } from "@fit-tracker/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

type UseWorkoutFormProps = {
  initialData?: {
    name?: string;
    exerciseIds?: number[];
  };
  onSubmit: (data: { name: string; exerciseIds: number[] }) => void;
};

export const useWorkoutForm = ({ initialData, onSubmit }: UseWorkoutFormProps) => {
  const [selectedExercises, setSelectedExercises] = useState<GetExercisesResponse[number][]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<{ name: string; exerciseIds: number[] }>({
    resolver: zodResolver(createWorkoutSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      exerciseIds: initialData?.exerciseIds || [],
    },
  });

  const toggleSelection = (exercise: GetExercisesResponse[number]) => {
    setSelectedExercises((prev) => {
      const newIds = prev.includes(exercise)
        ? prev.filter(e => e.id !== exercise.id)
        : [...prev, exercise];

      setValue(
        "exerciseIds",
        newIds.map(e => e.id),
      );
      return newIds;
    });
  };

  const hasSelection = selectedExercises.length > 0;

  const wrappedHandleSubmit = handleSubmit((data) => {
    onSubmit({ ...data, exerciseIds: selectedExercises.map(e => e.id) });
  });

  return {
    errors,
    isValid,
    register,
    handleSubmit: wrappedHandleSubmit,
    setValue,
    selectedExercises,
    toggleSelection,
    hasSelection,
  };
};
