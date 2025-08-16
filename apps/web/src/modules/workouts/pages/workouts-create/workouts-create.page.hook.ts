import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkoutSchema } from "@/dtos/workouts/requests";
import type { CreateWorkoutRequest } from "@/dtos/workouts/requests";
import { useCreateWorkoutMutation } from "@/web/modules/workouts/hooks/mutations";
import { useNavigate } from "@tanstack/react-router";

type UseWorkoutFormProps = {
  initialData?: {
    name?: string;
    exerciseIds?: number[];
  };
};

export const useWorkoutForm = ({ initialData }: UseWorkoutFormProps) => {
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>(
    initialData?.exerciseIds || []
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

  const toggleSelection = (exerciseId: number) => {
    setSelectedExerciseIds(prev => {
      const newIds = prev.includes(exerciseId)
        ? prev.filter(e => e !== exerciseId)
        : [...prev, exerciseId];

      setValue("exerciseIds", newIds);
      return newIds;
    });
  };

  const hasSelection = selectedExerciseIds.length > 0;

  return {
    errors,
    isValid,
    register,
    handleSubmit,
    selectedExerciseIds,
    toggleSelection,
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