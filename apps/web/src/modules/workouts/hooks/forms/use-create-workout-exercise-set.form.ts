import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { type CreateSetRequest, createSetSchema } from "@/dtos/sets/requests";
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
  const form = useForm<CreateSetRequest>({
    resolver: zodResolver(createSetSchema),
    defaultValues: {
      workoutExerciseId,
      reps: 0,
      weight: 0,
      rir: undefined,
      notes: undefined,
    },
  });

  const { mutate: createSet, isPending } = useCreateWorkoutExerciseSetMutation({
    workoutId,
    workoutExerciseId,
  });

  const handleSubmit = (data: CreateSetRequest) => {
    createSet(
      {
        set: data,
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
