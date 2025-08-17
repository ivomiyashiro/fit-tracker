import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import type { CreateWorkoutRequest } from "@/dtos/workouts/requests";

import { createWorkoutSchema } from "@/dtos/workouts/requests";
import { useExerciseSelection } from "@/web/modules/workouts/components/exercise-list/use-exercise-selection.hook";
import { useCreateWorkoutMutation } from "@/web/modules/workouts/hooks/mutations";

type UseWorkoutFormProps = {
  initialData?: {
    name?: string;
    exerciseIds?: number[];
  };
};

export const useWorkoutForm = ({ initialData }: UseWorkoutFormProps) => {
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

  const { selectedExerciseIds, toggleSelection, hasSelection } = useExerciseSelection({
    initialIds: initialData?.exerciseIds || [],
    onChange: exerciseIds => setValue("exerciseIds", exerciseIds),
  });

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
