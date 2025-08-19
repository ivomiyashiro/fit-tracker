import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { CreateWorkoutRequest } from "@/dtos/workouts/requests";
import type { Exercise } from "@/web/modules/workouts/types";

import { createWorkoutSchema } from "@/dtos/workouts/requests";
import { useCreateWorkoutMutation } from "@/web/modules/workouts/hooks/mutations";

type UseWorkoutFormProps = {
  initialData?: {
    name?: string;
    exerciseIds?: number[];
  };
};

export const useWorkoutForm = ({ initialData }: UseWorkoutFormProps) => {
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>(
    initialData?.exerciseIds || [],
  );

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

  const handleSelectionChanged = (exercises: Exercise[]) => {
    console.log(exercises);
  };

  const hasSelection = selectedExerciseIds.length > 0;

  return {
    errors,
    isValid,
    register,
    handleSubmit,
    setValue,
    selectedExerciseIds,
    handleSelectionChanged,
    hasSelection,
  };
};

export const useCreateWorkout = () => {
  const navigate = useNavigate();
  const { mutate: createWorkout, isPending } = useCreateWorkoutMutation();

  const handleCreateWorkout = (data: CreateWorkoutRequest) => {
    createWorkout(data, {
      onSuccess: () => {
        navigate({ to: "/workouts" });
      },
    });
  };

  return {
    createWorkout: handleCreateWorkout,
    isPending,
  };
};
