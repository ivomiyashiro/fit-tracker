import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { UpdateSetRequest } from "@/dtos/sets/requests";
import type { WorkoutExerciseSet } from "@/web/modules/workouts/types";

import { updateSetSchema } from "@/dtos/sets/requests";
import { useUpdateWorkoutExerciseSetMutation } from "@/web/modules/workouts/hooks/mutations";

export const useUpdateWorkoutExerciseSetForm = ({
  setId,
  initialData,
}: {
  setId: number;
  initialData: WorkoutExerciseSet;
}) => {
  const { workoutId, workoutExerciseId } = useParams({
    from: "/_authenticated/workouts/$workoutId/we/$workoutExerciseId/sets/$setId/",
  });
  const navigate = useNavigate();

  const form = useForm<UpdateSetRequest>({
    resolver: zodResolver(updateSetSchema),
    defaultValues: {
      reps: initialData.reps,
      weight: initialData.weight,
      rir: initialData.rir || undefined,
      notes: initialData.notes || "",
    },
  });

  const { mutate: updateSet, isPending } = useUpdateWorkoutExerciseSetMutation(setId);

  const handleSubmit = (data: UpdateSetRequest) => {
    updateSet(
      data,
      {
        onSuccess: () => {
          navigate({
            to: "/workouts/$workoutId/we/$workoutExerciseId/sets",
            params: {
              workoutId,
              workoutExerciseId,
            },
          });
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
