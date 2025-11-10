import { Controller } from "react-hook-form";

import { Button, FormField, IncrementInput, Textarea } from "@/web/components/ui";
import { useCreateWorkoutExerciseSetDrawerForm } from "@/web/modules/workouts/pages/workout-exercise-sets/create-set-drawer/create-set-drawer-form.hook";

type Props = {
  workoutSessionId?: number;
  workoutExerciseId: number;
  onSuccess?: () => void;
};

export const CreateSetDrawerForm = ({
  workoutSessionId,
  workoutExerciseId,
  onSuccess,
}: Props) => {
  const { form, handleSubmit, isValid } = useCreateWorkoutExerciseSetDrawerForm({
    workoutSessionId,
    workoutExerciseId,
    onSuccess,
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField
        label="Repetitions"
        id="reps"
        error={errors.reps}
        register={register("reps", { valueAsNumber: true })}
      >
        <Controller
          name="reps"
          control={control}
          render={({ field }) => (
            <IncrementInput
              value={field.value?.toString() || ""}
              onChange={value => field.onChange(value ? Number.parseInt(value) : undefined)}
              step={1}
              min={1}
              placeholder="8"
            />
          )}
        />
      </FormField>

      <FormField
        label="Weight (kg)"
        id="weight"
        error={errors.weight}
        register={register("weight", { valueAsNumber: true })}
      >
        <Controller
          name="weight"
          control={control}
          render={({ field }) => (
            <IncrementInput
              value={field.value?.toString() || ""}
              onChange={value => field.onChange(value ? Number.parseFloat(value) : undefined)}
              step={2.5}
              min={0}
              placeholder="0"
            />
          )}
        />
      </FormField>

      <FormField
        label="RIR (Reps in Reserve)"
        id="rir"
        error={errors.rir}
        register={register("rir", { valueAsNumber: true })}
      >
        <Controller
          name="rir"
          control={control}
          render={({ field }) => (
            <IncrementInput
              value={field.value?.toString() || ""}
              onChange={value => field.onChange(value ? Number.parseInt(value) : undefined)}
              step={1}
              min={0}
              max={10}
              placeholder="0-10"
            />
          )}
        />
      </FormField>

      <FormField label="Notes" id="notes" error={errors.notes} register={register("notes")}>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea {...field} id="notes" placeholder="Add any notes..." className="min-h-20" />
          )}
        />
      </FormField>

      <Button type="submit" disabled={!isValid} className="w-full mt-2">
        Record Set
      </Button>
    </form>
  );
};
