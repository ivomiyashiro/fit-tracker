import {
  type GetWorkoutExerciseSetsResponse,
  type UpdateWorkoutExerciseSetRequest,
  updateWorkoutExerciseSetSchema,
} from "@fit-tracker/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useUpdateWorkoutExerciseSetMutation } from "@/web/modules/workouts/hooks/mutations";

export const useUpdateWorkoutExerciseSetForm = ({
  workoutId,
  workoutExerciseId,
  initialData,
  onSuccess,
}: {
  workoutId: number;
  workoutExerciseId: number;
  initialData: GetWorkoutExerciseSetsResponse["data"][number];
  onSuccess?: () => void;
}) => {
  const form = useForm<UpdateWorkoutExerciseSetRequest>({
    resolver: zodResolver(updateWorkoutExerciseSetSchema),
    defaultValues: {
      reps: initialData.reps,
      weight: initialData.weight,
      rir: initialData.rir || undefined,
      rpe: initialData.rpe || undefined,
      notes: initialData.notes || "",
    },
  });

  const { mutate: updateSet, isPending } = useUpdateWorkoutExerciseSetMutation({
    workoutId,
    workoutExerciseId,
  });

  const handleSubmit = (data: UpdateWorkoutExerciseSetRequest) => {
    updateSet(
      {
        setId: initialData.id,
        set: {
          reps: data.reps,
          weight: data.weight,
          rir: data.rir,
          rpe: data.rpe,
          notes: data.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (error) => {
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
