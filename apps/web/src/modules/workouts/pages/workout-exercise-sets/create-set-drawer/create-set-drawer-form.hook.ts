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

  const { mutate: createSet } = useCreateWorkoutExerciseSetMutation();

  const handleSubmit = (data: CreateSetRequest) => {
    // Reset form and close drawer immediately (optimistic)
    form.reset();
    onSuccess?.();

    // Show optimistic success message
    toast.success("Set recorded!");

    // Execute mutation in the background
    createSet(
      {
        workoutExerciseId,
        reps: data.reps,
        weight: data.weight,
        rir: data.rir,
        notes: data.notes,
      },
      {
        onError: (error) => {
          toast.error(error.message || "Failed to record set");
        },
      },
    );
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isValid: form.formState.isValid,
  };
};
