import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { type CreateSetRequest, createSetSchema } from "@/dtos/sets/requests";
import { useCreateWorkoutExerciseSetMutation } from "@/web/modules/workouts/hooks/mutations";

type Props = {
  workoutExerciseId: number;
  onSuccess?: () => void;
};

export const useCreateWorkoutExerciseSetDrawerForm = ({
  workoutExerciseId,
  onSuccess,
}: Props) => {
  const form = useForm<CreateSetRequest>({
    resolver: zodResolver(createSetSchema),
    defaultValues: {
      workoutExerciseId,
      reps: 0,
      weight: 0,
      rir: 0,
      notes: "",
    },
  });

  const { mutate: createSet, isPending } = useCreateWorkoutExerciseSetMutation();

  const handleSubmit = (data: CreateSetRequest) => {
    createSet(
      {
        workoutExerciseId,
        reps: data.reps,
        weight: data.weight,
        rir: data.rir,
        notes: data.notes,
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
