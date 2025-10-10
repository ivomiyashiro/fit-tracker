import type { CreateWorkoutRequest } from "@/dtos/workouts/requests";
import type { Exercise } from "@/web/modules/workouts/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { createWorkoutSchema } from "@/dtos/workouts/requests";
import { useCreateWorkoutMutation } from "@/web/modules/workouts/hooks/mutations";

type UseWorkoutFormProps = {
  initialData?: {
    name?: string;
    exercises?: Exercise[];
  };
};

const useWorkoutForm = ({ initialData }: UseWorkoutFormProps = {}) => {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>(
    initialData?.exercises || [],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<CreateWorkoutRequest>({
    resolver: zodResolver(createWorkoutSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      exerciseIds: initialData?.exercises?.map(e => e.id) || [],
    },
  });

  const handleSelectionChanged = useCallback((exercises: Exercise[]) => {
    setValue("exerciseIds", exercises.map(e => e.id));
    setSelectedExercises(exercises);
  }, [setValue]);

  const hasSelection = selectedExercises.length > 0;

  return {
    errors,
    handleSelectionChanged,
    handleSubmit,
    hasSelection,
    isValid,
    control,
    register,
    selectedExercises,
    setValue,
  };
};

export const useCreateWorkout = ({ initialData }: UseWorkoutFormProps = {}) => {
  const {
    register,
    handleSubmit,
    selectedExercises,
    handleSelectionChanged,
    hasSelection,
    errors,
    control,
  } = useWorkoutForm({ initialData });

  const navigate = useNavigate();
  const { mutate: createWorkout, isPending } = useCreateWorkoutMutation();

  const handleCreateWorkout = handleSubmit((data: CreateWorkoutRequest) => {
    createWorkout(data, {
      onSuccess: () => {
        navigate({ to: "/workouts" });
      },
    });
  });

  return {
    // Form state
    errors,
    handleSelectionChanged,
    hasSelection,
    register,
    selectedExercises,
    control,

    // Actions
    handleCreateWorkout,
    isPending,
  };
};
