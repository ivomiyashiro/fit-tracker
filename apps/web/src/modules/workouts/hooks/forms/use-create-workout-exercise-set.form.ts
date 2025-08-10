import {
  type CreateWorkoutExerciseSetRequest,
  createWorkoutExerciseSetSchema,
} from "@fit-tracker/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateWorkoutExerciseSetMutation } from "@/web/modules/workouts/hooks/mutations";

export const useCreateWorkoutExerciseSetForm = ({
  workoutId,
  workoutExerciseId,
  onSuccess,
}: {
  workoutId: number;
  workoutExerciseId: number;
  onSuccess?: () => void;
}) => {
  const form = useForm<CreateWorkoutExerciseSetRequest>({
    resolver: zodResolver(createWorkoutExerciseSetSchema),
    defaultValues: {
      reps: undefined,
      weight: undefined,
      rir: undefined,
      notes: "",
    },
  });

  const { mutate: createSet, isPending } = useCreateWorkoutExerciseSetMutation({
    workoutId,
    workoutExerciseId,
  });

  const handleSubmit = (data: CreateWorkoutExerciseSetRequest) => {
    createSet(
      {
        reps: data.reps,
        weight: data.weight,
        rir: data.rir,
        notes: data.notes || undefined,
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to record set");
        },
      },
    );
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isPending,
    isValid: form.formState.isValid,
  };
};
