import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { UpdateSetRequest } from "@/dtos/sets/requests";
import type { WorkoutExerciseSet } from "@/web/modules/workouts/types";

import { updateSetSchema } from "@/dtos/sets/requests";
import { useUpdateWorkoutMutation } from "@/web/modules/workouts/hooks/mutations";

export const useUpdateWorkoutExerciseSetForm = ({
  workoutId,
  workoutExerciseId,
  initialData,
  onSuccess,
}: {
  workoutId: number;
  workoutExerciseId: number;
  initialData: WorkoutExerciseSet;
  onSuccess?: () => void;
}) => {
  const form = useForm<UpdateSetRequest>({
    resolver: zodResolver(updateSetSchema),
    defaultValues: {
      reps: initialData.reps,
      weight: initialData.weight,
      rir: initialData.rir || undefined,
      notes: initialData.notes || "",
    },
  });

  const { mutate: updateSet, isPending } = useUpdateWorkoutMutation({
    workoutId,
  });

  const handleSubmit = (data: UpdateSetRequest) => {
    updateSet(
      {
        workoutId,
        workout: {
          reps: data.reps,
          weight: data.weight,
          rir: data.rir,
          notes: data.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: error => {
          toast.error(error.message || "Failed to update set");
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
